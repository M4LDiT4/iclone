import SummaryService from "./SummaryService";
import SummaryDBService from "./localDB/SummaryDBService";
import ConversationSlidingWindow from "../domain/algorithms/ConversationSlidingWindow";
import SummaryStack from "@/domain/dataStructures/SummaryStack";
import LocalMessageDBService from "./localDB/LocalMessageDBService";
import SenderType from "@/domain/types/senderTypes";

interface ChatServiceProps {
  chatId: string,
  maxConversationCount: number,
  summaryService: SummaryService;
  summaryDBService: SummaryDBService;
  slidingWindowDBService: LocalMessageDBService;
}

class ChatService {
  chatId: string;

  slidingWindow: ConversationSlidingWindow;
  summaryStack: SummaryStack;

  summaryService: SummaryService;
  summaryDBService: SummaryDBService;

  localMessageDBService: LocalMessageDBService;

  constructor(props: ChatServiceProps){
    this.chatId = props.chatId;
    this.summaryService = props.summaryService;
    this.summaryDBService = props.summaryDBService;
    this.localMessageDBService = props.slidingWindowDBService;

    this.slidingWindow = new ConversationSlidingWindow({
      queueMaxSize: props.maxConversationCount,
      chatId: this.chatId,
      localMessageDBService: this.localMessageDBService
    });

    this.summaryStack = new SummaryStack({
      summaryDBService: this.summaryDBService,
      summaryService: this.summaryService,
      chatId: this.chatId
    });

  }

  async initializeChat(){
    // initialize all data structures here
    await this.slidingWindow.initialize();
    await this.summaryStack.intialize();
  }
  // insert latest conversation of the user and system to the sliding window
  async insertNewConversation(message: string, sender: SenderType) {
    await this.slidingWindow.insertRawConversation(message, sender);
    if(this.slidingWindow.isFull()){
      const summarizedContent = await this.summaryService.summarize(this.slidingWindow.contentsToString());
      await this.summaryStack.pushLeaf(summarizedContent)
      await this.slidingWindow.clear();
    }
  }
}

export default ChatService;