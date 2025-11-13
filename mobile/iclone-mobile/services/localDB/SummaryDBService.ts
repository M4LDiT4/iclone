import SummaryModel from "@/data/database/models/summaryModel";
import SummarStackItemModel from "@/data/database/models/summaryStackModel";
import SummaryNode from "@/domain/dataStructures/SummaryNode";
import SummaryType from "@/domain/types/summaryTypes";
import { Database, Q } from "@nozbe/watermelondb";

class SummaryDBService {
  database: Database;

  constructor(database: Database){
    this.database = database;
  }

  async getNewLeafIndex(chatId: string): Promise<number> { 
    const leaves = await this.database.get<SummaryModel>('summaries')
                        .query(
                          Q.where('chat_id', chatId), 
                          Q.where("summary_type", "leaf"),
                          Q.sortBy('created_by', Q.desc)
                        );
    // if leaves is empty, it means that there is no summary
    // leaf yet so return 0 (start of the index)
    if(leaves.length === 0){
      return 0;
    }
    return leaves[0].index + 1;
  }

  async getNewNodeIndex(chatId: string): Promise<number> {
    const leaves = await this.database.get<SummaryModel>('summaries')
                        .query(
                          Q.where('chat_id', chatId), 
                          Q.where("summary_type", "node"),
                          Q.sortBy('created_by', Q.desc)
                        );
    // if summary nodes is empty meaning there is no 
    // summary node yet so return 0 (start of the index)
    if(leaves.length === 0){
      return 0;
    }
    return leaves[0].index + 1;
  }

  async pushSummaryNode(node: SummaryNode, type: SummaryType): Promise<SummaryModel> {
    // creating a new summary node also pushes the node info
    // on the summary stack items (or simply in the stack)
    var summaryModel: SummaryModel | null = null;
    await this.database.write(
      async () => {
        // save the summary
        summaryModel = await this.database.get<SummaryModel>('summaries')
        .create(
          summary => {
            summary.chatId = node.chatId,
            summary.summary = node.summary,
            // if this is a node, find the left and right child id
            summary.summaryType = type,
            summary.size = node.size,
            summary.index = node.index
            // insert left and right here if node
          }
        );
        // Save newly added node to the stack (for persistent reference)
        if(summaryModel === null){
          throw Error(`Failed to save summary node to the database`);
        }

        await this.database.get<SummarStackItemModel>('summary_stack_items')
        .create(
          stack_item => {
            stack_item.chatId = node.chatId,
            stack_item.summaryId = summaryModel!.id
          }
        );
      }
    );
    if(summaryModel === null){
      throw Error(`Failed to save summary node to local database`)
    }
    return summaryModel;
  }

  async createLeaf (leaf: SummaryNode, messageIdList: string[]){
    // save a leaf
    // save also the list of message id that is associated with this leaf
  }
  async popSummaryNode(node: SummaryNode) {
    // remove the Summary node  from the Summary Stack table
  }
}

export default SummaryDBService;