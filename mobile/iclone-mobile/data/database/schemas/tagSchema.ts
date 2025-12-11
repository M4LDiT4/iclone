import { tableSchema } from "@nozbe/watermelondb";

const tagSchema = tableSchema({
  name: 'tags',
  columns: [
    {name: 'name', type: 'string'}
  ]
});

export default tagSchema;