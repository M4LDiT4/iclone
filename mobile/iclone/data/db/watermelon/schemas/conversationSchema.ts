import { tableSchema } from '@nozbe/watermelondb';

export const conversationsSchema = tableSchema({
  name: 'conversations',
  columns: [
    { name: 'chat_id', type: 'string', isIndexed: true },
    { name: 'system_message', type: 'string' },
    { name: 'user_message', type: 'string' },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});