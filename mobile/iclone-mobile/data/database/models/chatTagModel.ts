import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";
import ChatModel from "./chatModel";
import { TagModel } from "./tagModel";

export class ChatTagModel extends Model {
  static table = 'chat_tags';

  @field('chat_id') chatId!: string;
  @field('tag_id') tagId!: string;
  
  @relation('chats', 'chat_id') chat!: ChatModel;
  @relation('tags', 'tag_id') tag!: TagModel;
}