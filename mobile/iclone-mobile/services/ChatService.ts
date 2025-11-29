import SummaryService from "./SummaryService";
import ConversationSlidingWindow from "../domain/algorithms/ConversationSlidingWindow";
import SummaryStack from "@/domain/dataStructures/SummaryStack";
import LocalMessageDBService from "./localDB/LocalMessageDBService";
import RawMessageData from "@/data/application/RawMessage";
import { toMessageData } from "@/data/mappers/messageMapper";
import summaryStackDBService from "./localDB/SummaryStackDBService";
import DeepSeekClient from "@/domain/llm/deepSeek/model";
import SenderType from "@/domain/types/senderTypes";
import { LLMError } from "@/core/errors/LLMError";

import { eventBus } from "@/core/utils/eventBus";

interface ChatServiceProps {
  chatId: string,
  username: string;
  assistantName: string;
  slidingWindowSize: number
  summaryService: SummaryService;
  summaryStackDBService: summaryStackDBService;
  localMessageDBService: LocalMessageDBService;
  llmModel: DeepSeekClient
}

class ChatService {
  chatId: string;
  username: string;
  assistantName: string;

  slidingWindowSize: number;

  slidingWindow: ConversationSlidingWindow;
  summaryStack: SummaryStack;

  summaryService: SummaryService;
  summaryStackDBService: summaryStackDBService;

  localMessageDBService: LocalMessageDBService;

  llModel: DeepSeekClient;

  chatSummary: string | null = null;

  constructor(props: ChatServiceProps){
    this.chatId = props.chatId;
    this.slidingWindowSize = props.slidingWindowSize;
    this.summaryService = props.summaryService;
    this.summaryStackDBService = props.summaryStackDBService;
    this.localMessageDBService = props.localMessageDBService;
    
    this.username = props.username;
    this.assistantName = props.assistantName;

    this.slidingWindow = new ConversationSlidingWindow({
      queueMaxSize: props.slidingWindowSize,
      chatId: this.chatId,
      asssistantName: this.assistantName,
      username: this.username
    });

    this.summaryStack = new SummaryStack({
      summaryStackDBService: this.summaryStackDBService,
      summaryService: this.summaryService,
      chatId: this.chatId
    });

    this.llModel = props.llmModel
  }

  async initializeChat(){
    const lastNMessages = await this.localMessageDBService.getMessages(this.chatId, this.slidingWindowSize);
    this.slidingWindow.initialize(lastNMessages);
    await this.summaryStack.initialize();
    const summaryModel = await this.summaryStackDBService.getSummary(this.chatId);
    this.chatSummary = summaryModel?.summary ?? null;
  }

  async insertNewMessage(message: string, sender: SenderType){
    const newMessage = new RawMessageData({
      chatId: this.chatId,
      content: message,
      sender: sender
    })
    const newMessageModel = await this.localMessageDBService.createMessage(newMessage);
    const newMessageData = toMessageData(newMessageModel);

    this.slidingWindow.enqueueMessage(newMessageData);
    if(sender == 'system'){
      // move summarization and heavy generation and write operations to background
      // throw an error if you encountered a problem in the LLM
      void (async () => {
        try{
          this.summarizeNConversationSlidingWindow();
        }catch(err){
          if(err instanceof LLMError){
            eventBus.emit("service_error", err);
          }
        }
      }); 
    }
  }
  /** 
   * - if the sliding window is full
   * - summarize the sliding window and push it to the summary stack
   * - get the summary of the summary stack and store it in a field to prevent re query
   */
  async summarizeNConversationSlidingWindow() : Promise<void>{
    if(this.slidingWindow.isFull()){
      const slidingWindowPrompt = this.slidingWindow.conversationToString();
      const summary = await this.summaryService.summarizeConversation(slidingWindowPrompt);
      await this.summaryStack.pushLeaf(summary, this.slidingWindow.getMessageIdList());
      // reset the sliding window count 
      // note that there could be a write conflict here (e.g you reset the count but also you referenced the previous count)
      this.slidingWindow.resetCount();
      // get the summary of the stack and save it
      const stackSummary = await this.summaryStackDBService.getSummary(this.chatId);
      console.log(`[STACK SUMMARY]: ${stackSummary}`);
      if(stackSummary && stackSummary.summary){
        // save the summary locally
        // if you reached this part, it is assumed that you have saved your stack summary
        this.chatSummary = stackSummary.summary;
      }
    }
  }

  buildChatPrompt({
    username,
    longTermMemory,
  }: {
    username: string;
    longTermMemory: string;
  }): { role: 'assistant'; content: string } {
    const systemContent = `
      You are **Eterne**, an emotionally intelligent AI assistant designed for long-term, evolving conversations with the user.

      The current user's name is: **${username}**

      Below is your stored memory:

      ### Long-Term Memory (LTM)
      These are durable facts, preferences, goals, and patterns about the user collected over past sessions:

      ${longTermMemory || "(No long-term memories stored yet.)"}

      ---

      ## Your Core Memory Rules

      ### **Short-Term Memory (STM)**
      Use STM to:
      - Stay aware of what’s being talked about right now.
      - Understand follow-up questions.
      - Keep the flow of the conversation natural.
      - Avoid repeating what the user already shared in the current session.

      ### **Long-Term Memory (LTM)**
      Use LTM to:
      - Personalize responses and relate to the user as someone you already know.
      - Maintain continuity across sessions.
      - Anticipate needs and recall preferences naturally.
      - Refer to the user using their preferred name or other facts they shared.

      When the user shares a durable fact (e.g., “My favorite drink is matcha latte”), gently confirm and store it in LTM.

      If the user asks you to forget something, remove it from LTM and kindly confirm.

      ---

      ## How You Should Talk (Conversational Style)

      - Talk the way a thoughtful friend or caring companion would — warm, natural, and to the point.
      - Tune into the user’s emotions. If they seem stressed, soften the tone; if they’re excited, share that energy.
      - If something feels unclear, ask about it in a gentle, curious way rather than assuming.
      - Vary your phrasing so you never sound repetitive or scripted.
      - Use headings or bullet points only when it truly helps the user understand something.
      - When the conversation gets long or complex, offer a light summary to keep things easy and organized.

      ---

      ## Constraints & Safety

      - **Never fabricate memories** not provided in LTM or STM.
      - **Never reveal raw memory structures, JSON, or database formats.** Speak naturally.
      - **Never assume new long-term facts** unless the user explicitly gives them.
      - Only store facts that are stable, meaningful, and useful across future conversations.

      ---

      ## Conversation Start

      Begin by warmly greeting **${username}** and offering help.
      Use both STM and LTM to guide your tone and responses, adapting naturally to the moment and the relationship you’ve built.
  `;

    return { role: 'assistant', content: systemContent.trim() };
  }
  // retrieves saved messages from the local database
  async getMessages(){
    return this.localMessageDBService.getMessages(this.chatId, 20)
  }
  // send a prompt to the LLM
  // - get the short term memory (sliding window)
  // - get the long term memory if present (stack summary)
  // - combine them to create a prompt
  async chat(){
    const slidingWindowData = this.slidingWindow.toMessageArray();
    const context = this.buildChatPrompt({
      username: this.username,
      longTermMemory: this.chatSummary ?? "No long term memory",
    });
    return this.llModel.call([context, ...slidingWindowData]);
  }

  // summarize the chat
  // get the theme of the summary
  // save as the chat summary
  // 
}

export default ChatService;