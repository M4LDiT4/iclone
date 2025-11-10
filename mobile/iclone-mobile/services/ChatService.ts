import SummaryService from "./SummaryService";
import SummaryDBService from "./localDB/SummaryDBService";
import ConversationSlidingWindow from "../domain/algorithms/ConversationSlidingWindow";
import SummaryStack from "@/domain/dataStructures/SummaryStack";
import LocalMessageDBService from "./localDB/LocalMessageDBService";
import RawMessageData from "@/data/application/RawMessage";
import { toMessageData } from "@/data/mappers/messageMapper";
import messageDataListToPromptConverter from "@/domain/utils/messageDataListToPromptConverter";

interface ChatServiceProps {
  chatId: string,
  slidingWindowSize: number
  summaryService: SummaryService;
  summaryDBService: SummaryDBService;
  slidingWindowDBService: LocalMessageDBService;
  localMessageDBService: LocalMessageDBService;
}

class ChatService {
  chatId: string;

  slidingWindowSize: number;

  slidingWindow: ConversationSlidingWindow;
  summaryStack: SummaryStack;

  summaryService: SummaryService;
  summaryDBService: SummaryDBService;

  localMessageDBService: LocalMessageDBService;

  constructor(props: ChatServiceProps){
    this.chatId = props.chatId;
    this.slidingWindowSize = props.slidingWindowSize;
    this.summaryService = props.summaryService;
    this.summaryDBService = props.summaryDBService;
    this.localMessageDBService = props.slidingWindowDBService;

    this.slidingWindow = new ConversationSlidingWindow({
      queueMaxSize: props.slidingWindowSize,
      chatId: this.chatId,
    });

    this.summaryStack = new SummaryStack({
      summaryDBService: this.summaryDBService,
      summaryService: this.summaryService,
      chatId: this.chatId
    });

  }

  async initializeChat(){
    const lastNMessages = await this.localMessageDBService.getMessages(this.chatId, this.slidingWindowSize);
    await this.slidingWindow.initialize(lastNMessages);
    await this.summaryStack.intialize();
  }

  async insertNewMessage(message: RawMessageData){
    const newMessageModel = await this.localMessageDBService.createMessage(message);
    const newMessageData = toMessageData(newMessageModel);

    this.slidingWindow.enqueueMessage(newMessageData);
  }

  async summarizeNConversationSlidingWindow(){
    if(this.slidingWindow.isFull()){
      const slidingWindowPrompt = messageDataListToPromptConverter(this.slidingWindow.queue.toArray());
      const summary = await this.summaryService.summarize(slidingWindowPrompt);
      await this.summaryStack.pushLeaf(summary);
    }
  }
}

export default ChatService;