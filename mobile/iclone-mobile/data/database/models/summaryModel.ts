import SummaryType from "@/domain/types/summaryTypes";
import { Model } from "@nozbe/watermelondb";
import { date, readonly, text } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

export default class SummaryModel extends Model {
  static table ='summaries';

  static associations: Associations = {
    chats: {type: "belongs_to", key: 'chat_id'},
  }

  // learn how to have a one on one relationship 

  @text('chat_id')
  chatId!: string;

  @text('summary')
  summary!: string;

  // create association to the left and right summaries
  // they point to an document in this table if they are nodes
  // none nodes will have no left and right summary
  @text('left_summary')
  leftSummary!: string|null;
  @text('right_summary')
  rightSummary!: string|null;

  @text('summary_type')
  summaryType!: SummaryType

  @text('size')
  size!: number;

  @text('index')
  index!: number;
  

  @readonly @date('created_at') 
  createdAt!: Date;
  @readonly @date('updated_at') 
  updatedAt!: Date;

}