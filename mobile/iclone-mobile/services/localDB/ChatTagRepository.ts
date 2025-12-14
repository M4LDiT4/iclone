import { ChatTagModel } from "@/data/database/models/chatTagModel";
import { TagModel } from "@/data/database/models/tagModel";
import { Database, Q } from "@nozbe/watermelondb";

export class ChatTagRepository {
  database: Database;

  constructor(database: Database){
    this.database = database;
  }

  async getTagsByChatId(chatId: string) {
    const chatTags = await this.database.collections.get<ChatTagModel>(ChatTagModel.table)
                      .query(
                        Q.where('chat_id', chatId)
                      ).fetch();
    const tagIds = [...chatTags.map((ct) => ct.tagId)];
    const tags = await this.database.collections.get<TagModel>(TagModel.table)
                  .query(
                    Q.where("id", Q.oneOf(tagIds))
                  ).fetch();
    return tags;
  }
}