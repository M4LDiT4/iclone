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
    if(!this.isUser && message.sender == 'user'){
      // denote start of user input
      this.isUser = true;
    }else if(this.isUser && message.sender == 'system'){
      // makes sure that the first message is not counted (isUser starts false)
      // the system has replied, conversation count + 1
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