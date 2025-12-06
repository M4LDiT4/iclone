import { Model } from "@nozbe/watermelondb";
import { date, readonly, relation, text } from "@nozbe/watermelondb/decorators";
import ChatModel from "./chatModel";

export default class MemoryModel extends Model {
  static table = 'memories';

  @relation('chats', 'chat_id') chat!: ChatModel;

  @text('tag')
  tag!: string;

  @text('status')
  status!: 'pending' | 'completed'

  @text('title')
  title!: string;

  @text('narrative')
  narrative!: string

  @readonly @date('created_at')
  createdAt!: Date;

  @readonly @date('updated_at')
  updatedAt!: Date;
}