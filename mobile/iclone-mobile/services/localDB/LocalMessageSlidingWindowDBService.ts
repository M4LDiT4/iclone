import ConversationData from "@/data/application/ConversationData";
import MessageData from "@/data/application/MessageData";
import MessageModel from "@/data/database/models/messageModel";
import { Database } from "@nozbe/watermelondb";

class LocalMessageSlidingWindowDBService{
  database: Database

  constructor(database: Database){
    this.database = database;
  }
  
  async insertConversation(message: MessageData) {
    // insert conversation in the Conversation Table
    // insert reference of the conversation to the ConversationSlidingWindow
    await this.database.write(
      async () => {
        await this.database.get<MessageModel>('messages')
        .create(
          msg => {
            msg.content = message.content,
            msg.sender = message.sender
          }
        )
      }
    )
  }

  async getSlidingWindowConversations(chatId: String, limit: number): Promise<MessageData[]>{
    return [];
  }
}

export default LocalMessageSlidingWindowDBService;