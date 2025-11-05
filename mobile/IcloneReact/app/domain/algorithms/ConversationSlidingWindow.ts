import ConversationSlidingWindowDBService from "@/app/services/localDB/ConversationSlidingWindowDBService";
import Queue from "../data-structures/Queue";
import ConversationData from "@/app/models/data/ConversationData";

interface ConversationSlidingWindowProps{
  slidingWindowDBService: ConversationSlidingWindowDBService,
  chatId: string,
  queueMaxSize: number,
}

class ConversationSlidingWindow {
  slidingWindowDBService: ConversationSlidingWindowDBService
  queueMaxSize: number;
  queue = new Queue<ConversationData>();
  chatId: string;
 
  constructor(props: ConversationSlidingWindowProps){
    this.queueMaxSize = props.queueMaxSize;
    this.chatId = props.chatId;
    this.slidingWindowDBService = props.slidingWindowDBService;
  }

  async initialize(){
    const conversations = await this.slidingWindowDBService.getSlidingWindowConversations(this.chatId);
  }

  async insertRawConversation(systemMessage: string, userMessage: string){
    const conversation = new ConversationData({
      id: "id of the conversation in the local db",
      userMessage: userMessage,
      systemMessage: systemMessage,
      chatId: this.chatId
    })
    this.queue.enqueue(conversation);
    await this.handlePostEnqueu(conversation);
  }

  async inserConversation(conversation: ConversationData) {
    this.queue.enqueue(conversation);
    await this.handlePostEnqueu(conversation);
  }

  private async handlePostEnqueu(newConversation: ConversationData) {
    if(this.queue.size() === this.queueMaxSize){
      await this.dequeue();
    }
    await this.slidingWindowDBService.insertConversation(newConversation);
  }

  async dequeue() {
    const oldestItem = this.queue.dequeue();
    if(oldestItem){
      // remove the oldest item from sliding window table
      await this.slidingWindowDBService.popConversation(oldestItem);
    }
  }

  async clear(){
    while (!this.queue.isEmpty()){
      await this.dequeue();
    }
  }

  isFull(): boolean{
    return this.queueMaxSize === this.queue.size();
  }

  contentsToString(): string {
    const contents = this.queue.toArray();
    let contentString ="";
    for(const content of contents){
      contentString += `
        ['system'] : ${content.systemMessage}
        ['user] : ${content.userMessage}
      `
    }
    return contentString;
  }

}

export default ConversationSlidingWindow;