import { tableSchema } from "@nozbe/watermelondb";

const memorySchema = tableSchema({
  name: 'memories',
  columns: [
    {name: 'chat_id', type: 'string'},
    {name: 'tag', type: 'string'},
    {name: 'status', type: 'string'},
    {name: 'title', type: 'string'},
    {name: 'narrative', type: 'string'},
    {name: 'created_at', type: 'number'},
    {name: 'updated_at', type: 'number'}
  ]
});

export default memorySchema;