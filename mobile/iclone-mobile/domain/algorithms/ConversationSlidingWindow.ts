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

  initialize(messages: MessageData[]){
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

  enqueueMessage(message: MessageData){
    this.queue.enqueue(message);
    this.countMessage(message);
  }


  dequeue() {
    this.queue.dequeue();
  }

  clear(){
    while (!this.queue.isEmpty()){
      this.dequeue();
    }
  }

  isFull(): boolean{
    return this.queueMaxSize === this.conversationCount;
  }

  // convert the sliding window to a llm prompt
  contentsToString(): string {
    const contents = this.queue.toArray();
    let contentString ="";
    // do not include the last message
    // remember we count conversations by system message.
    for(var i = 0; i < contents.length - 1; i++){
      const content = contents[i];
      contentString += `
        [message]: ${content.content}
        [sender]: ${content.sender}
      `
    }
    return contentString;
  }

}

export default ConversationSlidingWindow;