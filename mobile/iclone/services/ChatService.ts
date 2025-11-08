import SummaryService from "./SummaryService";
import SummaryDBService from "./localDB/SummaryDBService";
import ConversationSlidingWindowDBService from "./localDB/ConversationSlidingWindowDBService";
import ConversationSlidingWindow from "../domain/algorithms/ConversationSlidingWindow";
import SummaryStack from "../domain/data-structures/SummaryStack";

interface ChatServiceProps {
  chatId: string,
  maxConversationCount: number,
  summaryService: SummaryService;
  summaryDBService: SummaryDBService;
  slidingWindowDBService: ConversationSlidingWindowDBService;
}

class ChatService {
  chatId: string;

  slidingWindow: ConversationSlidingWindow;
  summaryStack: SummaryStack;

  summaryService: SummaryService;
  summaryDBService: SummaryDBService;

  slidingWindowDBService: ConversationSlidingWindowDBService;

  constructor(props: ChatServiceProps){
    this.chatId = props.chatId;
    this.summaryService = props.summaryService;
    this.summaryDBService = props.summaryDBService;
    this.slidingWindowDBService = props.slidingWindowDBService;

    this.slidingWindow = new ConversationSlidingWindow({
      queueMaxSize: props.maxConversationCount,
      chatId: this.chatId,
      slidingWindowDBService: this.slidingWindowDBService
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
  async insertNewConversation(systemMessage: string, userMessage: string) {
    await this.slidingWindow.insertRawConversation(systemMessage, userMessage);
    if(this.slidingWindow.isFull()){
      const summarizedContent = await this.summaryService.summarize(this.slidingWindow.contentsToString());
      await this.summaryStack.pushLeaf(summarizedContent)
      await this.slidingWindow.clear();
    }
  }
}

export default ChatService;