import { LocalDBError } from "@/core/errors/LocalDBError";
import ChatModel from "@/data/database/models/chatModel";
import ChatStatus from "@/domain/types/chatStatus";
import { Database } from "@nozbe/watermelondb";

interface ChatDBServiceProps {
  database:Database,
  userId: string
}

export default class ChatDBService {
  database: Database
  userId: string;
  
  constructor({database, userId}: ChatDBServiceProps){
    this.database = database;
    this.userId = userId
  }

  async createNewChat(){
    try{
      const chat =  await this.database.write( async () => {
        return await this.database.get<ChatModel>(ChatModel.table)
          .create((chat) => {
            chat.userId = this.userId,
            chat.theme ="",
            chat.status ='ongoing',
            chat.agentId ='deep-seek'
          });
      });

      return chat;
    }catch(err){
      console.log(`Failed to create new chat: ${err}`);
      throw new LocalDBError("Failed to create new chat");
    }
  }

  async updateChat(chatId: string, { theme, status} : {theme: string | undefined, status: ChatStatus | undefined}){
    try{
      await this.database.write( async () => {
        const chat = await this.database.get<ChatModel>(ChatModel.table).find(chatId);
        await chat.update( record => {
          if(theme){
            record.theme = theme;
          }
          if(status){
            record.status;
          }
        })
      });
    }catch(err){
      console.error(`Failed to update chat: ${err}`);
      throw new LocalDBError(`Failed to update chat`);
    }
  }
}
