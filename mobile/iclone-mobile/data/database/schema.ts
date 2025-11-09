import { appSchema } from '@nozbe/watermelondb'
import chatSchema from './schemas/chatSchema'
import messageSchema from './schemas/messageSchema'
import summarySchema from './schemas/summarySchema'
import summaryStackItemSchema from './schemas/summaryStackItemSchema'

export default appSchema({
  version: 1,
  tables: [
    chatSchema,
    messageSchema,
    summarySchema,
    summaryStackItemSchema
  ]
})