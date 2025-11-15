import ChatStatus from "@/domain/types/chatStatus";
import { Model } from "@nozbe/watermelondb";
import { date, readonly, text } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

export default class ChatModel extends Model {
  static table = 'chats';

  static associations: Associations = {
    messages: { type: 'has_many', foreignKey: 'chat_id' }
  };

  @text('user_id')
  userId!: string;

  @text('theme')
  theme!: string;

  @text('status')
  status!: ChatStatus;

  @text('agent_id')
  agentId!: string;

  @readonly @date('created_at')
  createdAt!: Date;

  @readonly @date('updated_at')
  updatedAt!: Date;
}