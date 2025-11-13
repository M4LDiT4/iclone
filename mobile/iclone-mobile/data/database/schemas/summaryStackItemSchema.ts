import { tableSchema } from "@nozbe/watermelondb";

const summaryStackItemSchema = tableSchema({
  name: 'summary_stack_items',

  columns: [
    {name: 'chat_id', type: 'string', isIndexed: true},
    {name: 'summary_id', type: 'string', isIndexed: true},

    // timestamps
    {name: 'created_at', type: 'number'},
    {name: 'updated_at', type: 'number'}
  ]
});

export default summaryStackItemSchema; 