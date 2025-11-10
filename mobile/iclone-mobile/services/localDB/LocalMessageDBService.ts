import MessageData from "@/data/application/MessageData";
import RawMessageData from "@/data/application/RawMessage";
import MessageModel from "@/data/database/models/messageModel";
import { Database, Q } from "@nozbe/watermelondb";

class LocalMessageDBService {
  database: Database;

  constructor(database:Database){
    this.database = database;
  }

  async createMessage(message: RawMessageData): Promise<MessageModel> {
    const savedMessage = await this.database.write(async () => {
      return await this.database.get<MessageModel>('messages').create(msg => {
        msg.content = message.content
        msg.sender = message.sender
        msg.chatId = message.chatId
      })
    });
    return savedMessage
  }

  async getMessages(chatId: string, limit: number): Promise<MessageModel[]>{
    const messages = await this.database.get<MessageModel>('messages')    
                    .query(
                      Q.where("chat_id", chatId),
                      Q.sortBy('updated_by', Q.desc)
                    ).fetch();
    return messages.slice(0, limit);
  }
}

export default LocalMessageDBService;