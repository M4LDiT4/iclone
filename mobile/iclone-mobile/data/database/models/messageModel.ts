import { Model } from "@nozbe/watermelondb";
import { date, readonly, text } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

export default class MessageModel extends Model{
  static table = 'messages';

  static associations: Associations = {
    chats: {type: 'belongs_to', key: 'chat_id'}
  }

  @text('chat_id')
  chatId!: string;

  @text('content')
  content!: string;

  @readonly
  @date('created_at')
  createdAt!: Date;

  @readonly
  @date('updated_at')
  updatedAt!: Date;
}