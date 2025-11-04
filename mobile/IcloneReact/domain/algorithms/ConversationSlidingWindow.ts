import ConversationData from "@/models/data/ConversationData";
import Queue from "../data-structures/Queue";

interface ConversationSlidingWindowProps{
  chatId: string,
  queueMaxSize: number
}

class ConversationSlidingWindow {
  queueMaxSize: number;
  queue = new Queue<ConversationData>();
  chatId: string;

  constructor(props: ConversationSlidingWindowProps){
    this.queueMaxSize = props.queueMaxSize;
    this.chatId = props.chatId;
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
    //save the conversation to the sliding window table
  }

  async dequeue() {
    const oldestItem = this.queue.dequeue();
    if(oldestItem){
      // remove the oldest item from sliding window table
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

}

export default ConversationSlidingWindow;