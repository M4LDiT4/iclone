import MessageData from "@/data/application/MessageData";
import Queue from "../dataStructures/Queue";

interface ConversationSlidingWindowProps{
  chatId: string,
  queueMaxSize: number,
}

class ConversationSlidingWindow {
  isUser = false;
  conversationCount = 0;
  queueMaxSize: number;
  queue = new Queue<MessageData>();
  chatId: string;
 
  constructor(props: ConversationSlidingWindowProps){
    this.queueMaxSize = props.queueMaxSize;
    this.chatId = props.chatId;
  }

  async initialize(messages: MessageData[]){
    for(var message of messages){
      this.queue.enqueue(message);
      this.countMessage(message);
    }
  }

  countMessage(message: MessageData){
    // count only conversations 
    // conversation is defined as follows:
    // one system message followed by any number of user messages
    if(!this.isUser && message.sender == 'user'){
      this.isUser = true;
    }else if(this.isUser && message.sender == 'system'){
      this.isUser = false;
      this.conversationCount += 1;
    }
  }

  async enqueueMessage(message: MessageData){
    this.queue.enqueue(message);
    this.countMessage(message);
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
    return this.queueMaxSize === this.conversationCount;
  }

  // convert the sliding window to a llm prompt
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