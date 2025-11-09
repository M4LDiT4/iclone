import SummaryModel from "@/data/database/models/summaryModel";
import SummarStackItemModel from "@/data/database/models/summaryStackModel";
import SummaryNode from "@/domain/dataStructures/SummaryNode";
import SummaryType from "@/domain/types/summaryTypes";
import { Database } from "@nozbe/watermelondb";

class SummaryDBService {
  database: Database;

  constructor(database: Database){
    this.database = database;
  }

  async getNewLeafIndex(chatId: string): Promise<number> {
    // return the the new index for a leaf
    // idea is to get the latest index for a leaf associated with the chat id
    // that index + 1
    // 0 if there is no leaf for that chatId
    return 0;
  }

  async getNewNodeIndex(chatId: String): Promise<number> {
    // return the new index for a node
    // idea is to get the latest index for a node associated with the chat id
    // that index + 1
    // 0 if there is no node for that chatId
    return 0;
  }

  async pushSummaryNode(node: SummaryNode, type: SummaryType) {
    // creating a new summary node also pushes the node info
    // on the summary stack items (or simply in the stack)
    await this.database.write(
      async () => {
        const summaryModel = await this.database.get<SummaryModel>('summaries')
        .create(
          summary => {
            summary.chatId = node.chatId,
            summary.summary = node.summary,
            // if this is a node, find the left and right child id
            summary.summaryType = type,
            summary.size = node.size,
            summary.index = node.index
          }
        );

        await this.database.get<SummarStackItemModel>('summary_stack_items')
        .create(
          stack_item => {
            stack_item.chatId = node.chatId,
            stack_item.summaryId = summaryModel.id
          }
        )
      }
    )
  }

  async popSummaryNode(node: SummaryNode) {
    // remove the Summary node  from the Summary Stack table
  }
}

export default SummaryDBService;