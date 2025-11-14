import SummaryService from "./SummaryService";
import ConversationSlidingWindow from "../domain/algorithms/ConversationSlidingWindow";
import SummaryStack from "@/domain/dataStructures/SummaryStack";
import LocalMessageDBService from "./localDB/LocalMessageDBService";
import RawMessageData from "@/data/application/RawMessage";
import { toMessageData } from "@/data/mappers/messageMapper";
import messageDataListToPromptConverter from "@/domain/utils/messageDataListToPromptConverter";
import summaryStackDBService from "./localDB/SummaryStackDBService";

interface ChatServiceProps {
  chatId: string,
  username: string;
  assistantName: string;
  slidingWindowSize: number
  summaryService: SummaryService;
  summaryStackDBService: summaryStackDBService;
  slidingWindowDBService: LocalMessageDBService;
  localMessageDBService: LocalMessageDBService;
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

  constructor(props: ChatServiceProps){
    this.chatId = props.chatId;
    this.slidingWindowSize = props.slidingWindowSize;
    this.summaryService = props.summaryService;
    this.summaryStackDBService = props.summaryStackDBService;
    this.localMessageDBService = props.slidingWindowDBService;
    
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

  }

  async initializeChat(){
    const lastNMessages = await this.localMessageDBService.getMessages(this.chatId, this.slidingWindowSize);
    this.slidingWindow.initialize(lastNMessages);
    await this.summaryStack.initialize();
  }

  async insertNewMessage(message: RawMessageData){
    const newMessageModel = await this.localMessageDBService.createMessage(message);
    const newMessageData = toMessageData(newMessageModel);

    this.slidingWindow.enqueueMessage(newMessageData);
  }
  // do this when user stops writing
  async summarizeNConversationSlidingWindow(){
    if(this.slidingWindow.isFull()){
      const slidingWindowPrompt = messageDataListToPromptConverter(this.slidingWindow.queue.toArray());
      const summary = await this.summaryService.summarizeConversation(slidingWindowPrompt);
      await this.summaryStack.pushLeaf(summary, this.slidingWindow.getMessageIdList());
      this.slidingWindow.resetCount();
    }
  }


}

export default ChatService;