import { tableSchema } from "@nozbe/watermelondb";

export const messageSchema = tableSchema({
  name: 'messages',
  columns: [
    {name: 'chat_id', type: 'string', isIndexed: true},
    {name: 'content', type: 'string'},
    {name: 'created_at', type: 'number'},
    {name: 'updated_at', type: 'number'},  
  ]
});

export default messageSchema;