import { Model } from "@nozbe/watermelondb";
import { date, readonly, text } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

export default class ChatModel extends Model {
  static table ='chats';

  static associations: Associations = {
    conversations: {type: 'has_many', foreignKey: 'chat_id'}
  }

  @text('title') 
  title!: string;

  @readonly @date('created_at') 
  createdAt!: Date;
  @readonly @date('updated_at') 
  updatedAt!: Date;
  
}