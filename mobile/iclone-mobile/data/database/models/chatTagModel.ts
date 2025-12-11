import { Model } from "@nozbe/watermelondb";
import { relation } from "@nozbe/watermelondb/decorators";
import ChatModel from "./chatModel";
import { TagModel } from "./tagModel";

export class ChatTagModel extends Model {
  static table = 'chat_tags';

  @relation('chats', 'chat_id') chat!: ChatModel;
  @relation('tags', 'tag_id') tag!: TagModel;
}