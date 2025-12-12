import ChatModel from "@/data/database/models/chatModel";
import { ChatTagModel } from "@/data/database/models/chatTagModel";
import { Database, Q } from "@nozbe/watermelondb";

interface MemoryDBRepositoryProps {
  database: Database
}

export class MemoryDBRepository {
  database: Database;

  constructor(props: MemoryDBRepositoryProps){
    this.database = props.database;
  }

  async getMemoryByTag(tagId: string): Promise<ChatModel[]> {
    const chatTagCollection = this.database.collections.get<ChatTagModel>(ChatTagModel.table);
    const chatTagsByTag = await chatTagCollection.query(
      Q.where('tag_id', tagId)
    );
    const chatIds = chatTagsByTag.map((ct) => ct.chat_id);

    const chats = await this.database.collections.get<ChatModel>(ChatModel.table)
                  .query(Q.where('id', Q.oneOf(chatIds)))
                  .fetch();
    return chats;
  }
}