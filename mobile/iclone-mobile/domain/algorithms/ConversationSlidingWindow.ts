import MessageData from "@/data/application/MessageData";
import Queue from "../dataStructures/Queue";
import SenderType from "../types/senderTypes";
import LocalMessageSlidingWindowDBService from "@/services/localDB/LocalMessageSlidingWindowDBService";

interface ConversationSlidingWindowProps{
  slidingWindowDBService: LocalMessageSlidingWindowDBService,
  chatId: string,
  queueMaxSize: number,
}

class ConversationSlidingWindow {
  slidingWindowDBService: LocalMessageSlidingWindowDBService
  queueMaxSize: number;
  queue = new Queue<MessageData>();
  chatId: string;
 
  constructor(props: ConversationSlidingWindowProps){
    this.queueMaxSize = props.queueMaxSize;
    this.chatId = props.chatId;
    this.slidingWindowDBService = props.slidingWindowDBService;
  }

  async initialize(){
    const messages = await this.slidingWindowDBService.getSlidingWindowConversations(this.chatId, this.queueMaxSize);
    for(var message of messages){
      this.queue.enqueue(message);
    }
  }

  async insertRawConversation(message: string, sender: SenderType){
    const messageData = new MessageData({
      id: "id of the conversation in the local db",
      content: message,
      chatId: this.chatId,
      sender: sender
    });
    // save the messsage first before enqueing to the queu
    await this.handlePostEnqueu(messageData);
    this.queue.enqueue(messageData);
  }

  private async handlePostEnqueu(messageData: MessageData) {
    if(this.queue.size() === this.queueMaxSize){
      await this.dequeue();
    }
    await this.slidingWindowDBService.insertConversation(messageData);
  }

  async dequeue() {
    this.queue.dequeue();
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
        [message]: ${content.content}
        [sender]: ${content.sender}
      `
    }
    return contentString;
  }

}

export default ConversationSlidingWindow;