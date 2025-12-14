import { tableSchema } from "@nozbe/watermelondb";

const chatTagSchema = tableSchema({
  name: 'chat_tags',
  columns: [
    {name: 'chat_id', type: 'string'},
    {name: 'tag_id', type: 'string'}
  ]
});

export default chatTagSchema;