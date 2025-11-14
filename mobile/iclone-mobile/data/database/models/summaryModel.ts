import { Model } from "@nozbe/watermelondb";
import { field, text, readonly, date, relation } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import SummaryType from "@/domain/types/summaryTypes";

export default class SummaryModel extends Model {
  static table = "summaries";

  static associations: Associations = {
    chats: { type: "belongs_to", key: "chat_id" },
  };

  /** ───── Fields ───── */
  @text("chat_id") chatId!: string;
  @text("summary") summary!: string;
  @field("size") size!: number;
  @field("index") index!: number;
  @text("summary_type") summaryType!: SummaryType;

  /** ───── Self-Referencing Relations ───── */
  @relation("summaries", "left_summary") leftSummaryRel!: SummaryModel;
  @relation("summaries", "right_summary") rightSummaryRel!: SummaryModel;

  /** ───── Raw IDs ───── */
  @text("left_summary") leftSummaryId!: string | null;
  @text("right_summary") rightSummaryId!: string | null;

  /** ───── Timestamps ───── */
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
}