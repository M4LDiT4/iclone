import { tableSchema } from "@nozbe/watermelondb";

const chatSchema = tableSchema({
  name: 'chats',
  columns: [
    {name: 'user_id', type: 'string'},
    {name: 'theme', type: 'string'},
    {name: 'status', type: 'string'},
    {name: 'agent_id', type: 'string'},
    // insert user id here if possible
    {name: 'created_at', type: 'number'},
    {name: 'updated_at', type: 'number'}
  ]
});

export default chatSchema;