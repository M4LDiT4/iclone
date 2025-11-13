import { Model} from "@nozbe/watermelondb";
import { field, relation, readonly, date } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";

export default class SummaryMessageModel extends Model {
  static table = "summary_messages";

  static associations: Associations = {
    summaries: { type: "belongs_to", key: "summary_id" },
    messages: { type: "belongs_to", key: "message_id" },
  };

  @field("summary_id") summaryId!: string;
  @field("message_id") messageId!: string;

  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;

  @relation("summaries", "summary_id") summary!: any;
  @relation("messages", "message_id") message!: any;
}
