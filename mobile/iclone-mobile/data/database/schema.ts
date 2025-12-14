import { appSchema } from '@nozbe/watermelondb'
import chatSchema from './schemas/chatSchema'
import messageSchema from './schemas/messageSchema'
import summarySchema from './schemas/summarySchema'
import summaryStackItemSchema from './schemas/summaryStackItemSchema'
import { summaryMessagesSchema } from './schemas/summaryMessageSchema'
import tagSchema from './schemas/tagSchema'
import chatTagSchema from './schemas/chatTagSchema'

export default appSchema({
  version: 1,
  tables: [
    chatSchema,
    messageSchema,
    summarySchema,
    summaryStackItemSchema,
    summaryMessagesSchema,
    tagSchema,
    chatTagSchema,
  ]
})