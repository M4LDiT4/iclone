import { Model } from '@nozbe/watermelondb';
import { children, date, readonly, text } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

export default class ConversationModel extends Model {
  static table = 'conversations';

  static associations: Associations = {
    chats: { type: 'belongs_to', key: 'chat_id' },
  };

  @text('chat_id')
  chatId!: string;

  @text('system_message')
  systemMessage!: string;

  @text('user_message')
  userMessage!: string;

  @readonly
  @date('created_at')
  createdAt!: Date;

  @readonly
  @date('updated_at')
  updatedAt!: Date;

  @children('conversations') conversations!: ConversationModel[]
}