import { tableSchema } from "@nozbe/watermelondb";

const summarySchema = tableSchema({
  name: 'summaries',
  columns: [
    {name: 'chat_id', type: 'string', isIndexed: true},
    {name: 'summary', type: 'string'},

    // number of nodes that this summary contains
    {name: 'size', type: 'number' },

    // index of the summary node (for tree building)
    {name: 'index', type: 'number'},
    
    // this is for `nodes` only
    {name: 'left_summary', type: 'string'},
    {name: 'right_summary', type: 'string', isOptional: true},

    // tells the difference between the types of summaries (e.g leaf, node, stack)
    {name: 'summary_type', type: 'string', isOptional: true},

    // add list of message references here if the summary is a leaf
    
    // timestamps
    {name: 'created_at', type: 'number'},
    {name: 'updated_at', type: 'number'}
  ]
});

export default summarySchema;