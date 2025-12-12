import { tableSchema } from "@nozbe/watermelondb";

const tagSchema = tableSchema({
  name: 'tags',
  columns: [
    {name: 'name', type: 'string', isOptional: false},
    {name: 'icon_library', type: 'string', isOptional: true},
    {name: 'icon_name', type: 'string', isOptional: true}
  ]
});

export default tagSchema;