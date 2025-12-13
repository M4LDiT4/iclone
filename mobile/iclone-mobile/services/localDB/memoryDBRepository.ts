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

  async getMemoryByTag(tagId: string, page = 1, pageSize = 10): Promise<ChatModel[]> {
    const chatTagCollection = this.database.collections.get<ChatTagModel>(ChatTagModel.table);
    const chatTagsByTag = await chatTagCollection.query(
      Q.where('tag_id', tagId)
    );
    const chatIds = chatTagsByTag.map((ct) => ct.chat_id);

    const skip = (page -1) * pageSize;
    const chats = await this.database.collections.get<ChatModel>(ChatModel.table)
                  .query(
                    Q.where('id', Q.oneOf(chatIds)),
                    Q.sortBy('updated_at', Q.desc),
                    Q.skip(skip),
                    Q.take(pageSize)
                  )
                  .fetch();
    return chats;
  }

  async getOngoingChats():Promise<ChatModel[]> {
    const chatCollection = this.database.collections.get<ChatModel>(ChatModel.table);
    const ongoingChats = await chatCollection.query(
                          Q.where('status', 'ongoing')
                        ).fetch();
    return ongoingChats;
  }
}