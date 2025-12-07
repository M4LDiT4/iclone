import { LocalDBError } from "@/core/errors/LocalDBError";
import ChatModel from "@/data/database/models/chatModel";
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

  async updateChat(
    chatId: string,
    {
      tag,
      status,
      title,
      narrative,
    }: {
      tag?: string;
      status?: ChatStatus;
      title?: string;
      narrative?: string;
    }
  ) {
    try {
      await this.database.write(async () => {
        const chat = await this.database.get<ChatModel>(ChatModel.table).find(chatId);
        await chat.update((record) => {
          if (tag !== undefined) {
            record.tag = tag;
          }
          if (status !== undefined) {
            record.status = status;
          }
          if (title !== undefined) {
            record.title = title;
          }
          if (narrative !== undefined) {
            record.narrative = narrative;
          }
        });
      });
    } catch (err) {
      console.error(`Failed to update chat: ${err}`);
      throw new LocalDBError("Failed to update chat");
    }
  }
}