import { appSchema, tableSchema } from '@nozbe/watermelondb'
import chatSchema from './schemas/chatSchema'
import messageSchema from './schemas/messageSchema'

export default appSchema({
  version: 1,
  tables: [
    chatSchema,
    messageSchema
  ]
})