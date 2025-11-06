import { tableSchema } from "@nozbe/watermelondb";

export default tableSchema({
  name: 'chats',
  columns: [
    {name: 'title', type: 'string'},
    // insert user id here if possible
    {name: 'created_at', type: 'number'},
    {name: 'updated_at', type: 'number'}
  ]
})