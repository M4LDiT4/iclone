import { Model } from "@nozbe/watermelondb";
import { children, field } from "@nozbe/watermelondb/decorators";

export class TagModel extends Model {
  static table ='tags';

  @field('name') name!: string;

  @children('chat_tags') chatTags!: any;
}