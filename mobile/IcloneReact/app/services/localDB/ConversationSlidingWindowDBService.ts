import ConversationData from "@/app/models/data/ConversationData";

class ConversationSlidingWindowDBService{
  
  async insertConversation(conversation: ConversationData) {
    // insert conversation in the Conversation Table
    // insert reference of the conversation to the ConversationSlidingWindow
  }

  async popConversation(conversation: ConversationData) {
    // remove the reference of the conversation from the ConversationSlidingWindow
  }

  async getSlidingWindowConversations(chatId: String): Promise<ConversationData[]>{
    // get the conversations that is associated with the sliding window with the chatId and return
    return [];
  }
}

export default ConversationSlidingWindowDBService;