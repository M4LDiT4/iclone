import { LocalDBError } from "@/core/errors/LocalDBError";
import RawMessageData from "@/data/application/RawMessage";
import MessageModel from "@/data/database/models/messageModel";
import { Database, Q } from "@nozbe/watermelondb";

class LocalMessageDBService {
  database: Database;

  constructor(database:Database){
    this.database = database;
  }

  async createMessage(message: RawMessageData): Promise<MessageModel> {
    try{
      const savedMessage = await this.database.write(async () => {
        return await this.database.get<MessageModel>('messages').create(msg => {
          msg.content = message.content
          msg.sender = message.sender
          msg.chatId = message.chatId
        })
      });
    return savedMessage
    }catch(err){
      console.error(`Failed to create new message: ${err}`);
      throw new LocalDBError("Failed to create new message");
    }
  }

  async getMessages(chatId: string, limit: number, skip = 0): Promise<MessageModel[]>{
    try{
      const messages = await this.database.get<MessageModel>('messages')    
                      .query(
                        Q.where("chat_id", chatId),
                        Q.sortBy('created_at', Q.desc)
                      ).fetch();
      return messages.slice(skip, skip + limit);
    }catch(err){
      console.log(`Failed to get messages for chat with id ${chatId}: ${err}`);
      throw new LocalDBError("Failed to get messages")
    }
  }
}

export default LocalMessageDBService;