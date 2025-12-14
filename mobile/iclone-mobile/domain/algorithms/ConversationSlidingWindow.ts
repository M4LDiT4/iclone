import MessageData from "@/data/application/MessageData";
import Queue from "../dataStructures/Queue";

interface ConversationSlidingWindowProps{
  chatId: string,
  queueMaxSize: number,
  username: string,
  asssistantName: string
}

class ConversationSlidingWindow {
  isUser = false;
  conversationCount = 0;
  queueMaxSize: number;
  queue = new Queue<MessageData>();
  chatId: string;

  username: string;
  asssistantName: string;
 
  constructor(props: ConversationSlidingWindowProps){
    this.queueMaxSize = props.queueMaxSize;
    this.chatId = props.chatId;
    this.username = props.username;
    this,this.asssistantName = props.asssistantName;
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
    this.overFlowResolution();
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

  // convert the sliding window to DeepSeek-compatible messages
  toMessageArray(): { role: 'user' | 'assistant'; content: string }[] {
    const contents = this.queue.toArray();
    const messages: { role: 'user' | 'assistant'; content: string }[] = [];

    for (let i = 0; i < contents.length; i++) {
      const content = contents[i];
      const role = content.sender === 'system' ? 'assistant' : 'user';
      messages.push({ role, content: content.content });
    }

    return messages;
  }

  getMessageIdList(): string[] {
    const idList = [];
    const messageList = this.queue.toArray();
    for(var message of messageList){
      idList.push(message.id);
    }

    return idList;
  }

  // make sure to call this everytime you get the n summarization (the sliding window is full)
  // to prevent from summarizing everytime you insert a conversation once the sliding window
  // is full
  resetCount(){
    this.conversationCount = 0;
  }

  conversationToString(): string {
    const messages = this.toMessageArray();

    return messages
      .map(msg => {
        const sender =
          msg.role === "user"
            ? "User"
            : msg.role === "assistant"
            ? "Assistant"
            : "Unknown";

        return `${sender}: ${msg.content}`;
      })
      .join("\n");
  }

  // remove the conversation pair (batched user messages and the corresponding response)
  // we can have cases where there is consecutive llm/system messages on the queue
  // this is okay, as when queuing another system message will make this full and will again
  // dequeue the topmost item until we see another system message
  overFlowResolution(){
    if(this.isFull()){
      while(!this.queue.isEmpty()){
        const top = this.queue.peek();
        this.dequeue()
        if(top?.sender === 'system'){
          break;
        }
      }
    }
  }

}

export default ConversationSlidingWindow;