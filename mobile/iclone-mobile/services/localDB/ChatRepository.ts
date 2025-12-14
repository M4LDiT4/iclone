import { LocalDBError } from "@/core/errors/LocalDBError";
import ChatModel from "@/data/database/models/chatModel";
import { ChatTagModel } from "@/data/database/models/chatTagModel";
import { TagModel } from "@/data/database/models/tagModel";
import ChatStatus from "@/domain/types/chatStatus";
import { Database, Q } from "@nozbe/watermelondb";

interface ChatDBServiceProps {
  database: Database;
  userId: string;
}

export default class ChatRepository {
  database: Database;
  userId: string;

  constructor({ database, userId }: ChatDBServiceProps) {
    this.database = database;
    this.userId = userId;
  }

  async createNewChat() {
    try {
      const chat = await this.database.write(async () => {
        return await this.database.get<ChatModel>(ChatModel.table).create((chat) => {
          chat.userId = this.userId;
          chat.status = "ongoing";
          chat.agentId = "deep-seek";
          // tag, title, narrative are optional → left null initially
        });
      });

      return chat;
    } catch (err) {
      console.error(`Failed to create new chat: ${err}`);
      throw new LocalDBError("Failed to create new chat");
    }
  }

  /**
   * Updates a chat record and its associated tags.
   *
   * Performs a transactional update on a chat entry, modifying core fields
   * and synchronizing many-to-many tag associations. Any new tag names
   * not yet in the database are created before linking them to the chat.
   *
   * @async
   * @throws {LocalDBError} If the update operation fails or the transaction cannot complete.
   * @returns Resolves when the update and tag synchronization complete successfully.
   */
  async updateChat(
    chatId: string,
    {
      status,
      title,
      narrative,
      summary,
      tags,
      iconName,
      iconLibrary,
    }: {
      status?: ChatStatus;
      title?: string;
      narrative?: string;
      summary?: string,
      tags?: string[];
      iconName?: string,
      iconLibrary?: string
    }
  ) {
    try {
      await this.database.write(async () => {
        const chat = await this.database.get<ChatModel>(ChatModel.table).find(chatId);

        // Update chat fields
        await chat.update((record) => {
          if (status !== undefined) record.status = status;
          if (title !== undefined) record.title = title;
          if (summary !== undefined) record.summary = summary;
          if (narrative !== undefined) record.narrative = narrative;
          if (iconName) record.iconName = iconName;
          if (iconLibrary) record.iconLibrary = iconLibrary;
        });

        if (tags) {
          const tagsCollection = this.database.get<TagModel>(TagModel.table);
          const chatTagCollection = this.database.get<ChatTagModel>(ChatTagModel.table);

          // 1. Fetch all existing tags
          const existingTags = await tagsCollection.query().fetch();
          const existingNames = new Set(existingTags.map(t => t.name));

          // 2. Determine new tag names
          const newNames = tags.filter(name => !existingNames.has(name));

          // 3. Create new tags
          const newTagCreates = newNames.map(name =>
            tagsCollection.prepareCreate(tag => {
              tag.name = name;
            })
          );

          // Commit newly created tags
          if (newTagCreates.length > 0) {
            await this.database.batch(...newTagCreates);
          }

          // 4. Re-fetch tags matching the updated tag list
          const updatedTags = await tagsCollection
            .query(Q.where("name", Q.oneOf(tags)))
            .fetch();

          // Build map name → id (guaranteed valid IDs)
          const nameToId = new Map<string, string>();
          updatedTags.forEach(tag => nameToId.set(tag.name, tag.id));

          // 5. Load existing chat-tag relations
          const existingChatTags = await chatTagCollection
            .query(Q.where("chat_id", chat.id))
            .fetch();

          const existingTagIds = new Set(existingChatTags.map(ct => ct.tagId));

          // 6. Compute desired tag IDs
          const tagIdsToKeep = new Set(
            tags
              .map(name => nameToId.get(name))
              .filter((id): id is string => id !== undefined) // remove undefined
          );

          // 7. Determine which chatTag rows to delete
          const toDelete = existingChatTags.filter(
            ct => !tagIdsToKeep.has(ct.tagId)
          );

          if (toDelete.length > 0) {
            await this.database.batch(
              ...toDelete.map(ct => ct.prepareDestroyPermanently())
            );
          }

          // 8. Determine which new tag relations to add
          const toAdd = [...tagIdsToKeep].filter(id => !existingTagIds.has(id));

          const joinOps = toAdd.map(tagId =>
            chatTagCollection.prepareCreate(ct => {
              ct.chatId = chat.id;
              ct.tagId = tagId;
            })
          );

          if (joinOps.length > 0) {
            await this.database.batch(...joinOps);
          }
        }
      });
    } catch (err) {
      console.error(`Failed to update chat: ${err}`);
      throw new LocalDBError("Failed to update chat");
    }
  }

  async getChatByTag(tagId: string, page = 1, pageSize = 10): Promise<ChatModel[]> {
    const chatTagCollection = this.database.collections.get<ChatTagModel>(ChatTagModel.table);
    const chatTagsByTag = await chatTagCollection.query(
      Q.where('tag_id', tagId)
    );
    const chatIds = chatTagsByTag.map((ct) => ct.chatId);

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

  async getChatById(chatId: string){
    const chatCollection = this.database.collections.get<ChatModel>(ChatModel.table);
    const chat = await chatCollection.find(chatId);
    return chat;
  }
}