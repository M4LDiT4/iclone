import MessageData from "@/data/application/MessageData";
import Queue from "../dataStructures/Queue";
import SenderType from "../types/senderTypes";
import LocalMessageDBService from "@/services/localDB/LocalMessageDBService";

interface ConversationSlidingWindowProps{
  localMessageDBService: LocalMessageDBService,
  chatId: string,
  queueMaxSize: number,
}

class ConversationSlidingWindow {
  localMessageDBService: LocalMessageDBService;
  queueMaxSize: number;
  queue = new Queue<MessageData>();
  chatId: string;
 
  constructor(props: ConversationSlidingWindowProps){
    this.queueMaxSize = props.queueMaxSize;
    this.chatId = props.chatId;
    this.localMessageDBService = props.localMessageDBService;
  }

  async initialize(){
    const messages = await this.localMessageDBService.getMessages(this.chatId, this.queueMaxSize);
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
    await this.localMessageDBService.createMessage(messageData, this.chatId);
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