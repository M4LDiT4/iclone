import { tableSchema } from "@nozbe/watermelondb";

export const summaryMessagesSchema = tableSchema({
  name: "summary_messages",
  columns: [
    { name: "summary_id", type: "string", isIndexed: true },
    { name: "message_id", type: "string", isIndexed: true },
    { name: "created_at", type: "number" },
    {name: 'updated_at', type: 'number'}
  ],
});
