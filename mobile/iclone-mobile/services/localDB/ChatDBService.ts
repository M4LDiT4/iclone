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

export default class ChatDBService {
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
          chat.status = "ongoing" as ChatStatus;
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
   * This method performs a transactional update on a chat entry,
   * modifying core fields (status, title, narrative) and synchronizing
   * many-to-many tag associations. Any new tag names that do not yet
   * exist in the database are created before linking them to the chat.
   *
   * @async
   * @param {string} chatId
   *   The ID of the chat to update.
   *
   * @param {Object} params
   * @param {ChatStatus} [params.status]
   *   Optional new status for the chat.
   *
   * @param {string} [params.title]
   *   Optional new title for the chat.
   *
   * @param {string} [params.narrative]
   *   Optional narrative/description for the chat.
   *
   * @param {string[]} [params.tags]
   *   Optional array of tag names to associate with the chat.  
   *   - Any names not already present in the `TagModel` table are created.  
   *   - All provided tags are linked via `ChatTagModel` join records.
   *
   * @throws {LocalDBError}
   *   Thrown when the update operation fails or the transaction cannot complete.
   *
   * @returns {Promise<void>}
   *   Resolves when the update and tag synchronization complete successfully.
   */
  async updateChat(
    chatId: string,
    {
      status,
      title,
      narrative,
      tags,
    }: {
      status?: ChatStatus;
      title?: string;
      narrative?: string;
      tags?: string[];
    }
  ) {
    try {
      await this.database.write(async () => {
        const chat = await this.database.get<ChatModel>(ChatModel.table).find(chatId);

        // Update chat fields
        await chat.update((record) => {
          if (status !== undefined) record.status = status;
          if (title !== undefined) record.title = title;
          if (narrative !== undefined) record.narrative = narrative;
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

          const existingTagIds = new Set(existingChatTags.map(ct => ct.tag_id));

          // 6. Compute desired tag IDs
          const tagIdsToKeep = new Set(
            tags
              .map(name => nameToId.get(name))
              .filter((id): id is string => id !== undefined) // remove undefined
          );

          // 7. Determine which chatTag rows to delete
          const toDelete = existingChatTags.filter(
            ct => !tagIdsToKeep.has(ct.tag_id)
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
              ct.chat_id = chat.id;
              ct.tag_id = tagId;
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
}