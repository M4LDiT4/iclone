import { tableSchema } from "@nozbe/watermelondb";

const chatSchema = tableSchema({
  name: 'chats',
  columns: [
    {name: 'user_id', type: 'string', isOptional: false},
    {name: 'theme', type: 'string'}, 
    {name: 'status', type: 'string', isOptional: false},
    {name: 'agent_id', type: 'string', isOptional: false},
    {name: 'title', type: 'string'}, 
    {name: 'narrative', type: 'string'}, 
    // insert user id here if possible
    {name: 'created_at', type: 'number'},
    {name: 'updated_at', type: 'number'}
  ]
});

export default chatSchema;