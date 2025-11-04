import ConversationSlidingWindow from "@/domain/algorithms/ConversationSlidingWindow";

interface ChatServiceProps {
  chatId: string,
  maxConversationCount: number
}

class ChatService {
  chatId: string;
  slidingWindow: ConversationSlidingWindow;

  constructor(props: ChatServiceProps){
    this.chatId = props.chatId;
    this.slidingWindow = new ConversationSlidingWindow({
      queueMaxSize: props.maxConversationCount,
      chatId: this.chatId
    });
  }

  async initializeChat(){
    // get list of the conversations in the sliding window table associated with this chat id
    // and construct the sliding window
    //  
  }

  async insertNewConversation(systemMessage: string, userMessage: string) {
    await this.slidingWindow.insertRawConversation(systemMessage, userMessage);
    if(this.slidingWindow.isFull()){
      //summarize the queueu and insert to the summary tree
      await this.slidingWindow.clear();
    }
  }
}