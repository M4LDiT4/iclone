import { LocalDBError } from "@/core/errors/LocalDBError";
import ChatModel from "@/data/database/models/chatModel";
import { ChatTagModel } from "@/data/database/models/chatTagModel";
import { TagModel } from "@/data/database/models/tagModel";
import ChatStatus from "@/domain/types/chatStatus";
import { Database } from "@nozbe/watermelondb";

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

          // Fetch existing tags
          const existingTags: TagModel[] = await tagsCollection.query().fetch();
          const existingNames = new Set(existingTags.map((tag) => tag.name));

          // Filter out duplicates
          const newNames = tags.filter((name) => !existingNames.has(name));

          // Prepare new tag creations
          const preparedTags = newNames.map((name) =>
            tagsCollection.prepareCreate((tag) => {
              tag.name = name;
            })
          );

          // Commit new tags
          await this.database.batch(...preparedTags);

          // Collect all tags (existing + newly created)
          const allTags = [
            ...existingTags.filter((tag) => tags.includes(tag.name)),
            ...preparedTags,
          ];

          // Prepare join records
          const joinOps = allTags.map((tag) =>
            chatTagCollection.prepareCreate((chatTag) => {
              chatTag.chat_id = chat.id; // foreign key
              chatTag.tag_id = tag.id;   // foreign key
            })
          );

          // Commit join records
          await this.database.batch(...joinOps);
        }
      });
    } catch (err) {
      console.error(`Failed to update chat: ${err}`);
      throw new LocalDBError("Failed to update chat");
    }
  }
}