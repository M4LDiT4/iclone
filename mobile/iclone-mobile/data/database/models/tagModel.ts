import { Model } from "@nozbe/watermelondb";
import { children, field } from "@nozbe/watermelondb/decorators";

export class TagModel extends Model {
  static table ='tags';

  @field('name') name!: string;
  @field('icon_library') iconLibrary?: string | null
  @field('icon_name') iconName?: string | null

  @children('chat_tags') chatTags!: any;
}