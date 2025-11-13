import SummaryMessageModel from "@/data/database/models/summaryMessageModel";
import SummaryModel from "@/data/database/models/summaryModel";
import SummaryStackItemModel from "@/data/database/models/summaryStackItemModel";
import SummaryNode from "@/data/application/SummaryNode";
import SummaryType from "@/domain/types/summaryTypes";
import { Database, Q } from "@nozbe/watermelondb";
import RawSummaryData from "@/data/application/RawSummaryData";
import NodeType from "@/domain/types/nodeTypes";

class SummaryStackDBService {
    database: Database;

  constructor(database: Database){
    this.database = database;
  }

  async getNewLeafIndex(chatId: string): Promise<number> { 
    const leaves = await this.database.get<SummaryModel>('summaries')
      .query(
        Q.where('chat_id', chatId), 
        Q.where("summary_type", "leaf"),
        Q.sortBy('created_at', Q.desc) // use created_at instead of created_by
      );

    if (leaves.length === 0) return 0;
    return leaves[0].index + 1;
  }

  async getNewNodeIndex(chatId: string): Promise<number> {
    const nodes = await this.database.get<SummaryModel>('summaries')
      .query(
        Q.where('chat_id', chatId), 
        Q.where("summary_type", "node"),
        Q.sortBy('created_at', Q.desc)
      );

    if (nodes.length === 0) return 0;
    return nodes[0].index + 1;
  }


  async pushSummaryNode(node: RawSummaryData, type: SummaryType): Promise<SummaryNode> {
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

        await this.database.get<SummaryStackItemModel>('summary_stack_items')
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

    const summaryNode = await this.toSummaryNode(summaryModel);
    return summaryNode;
  }

  async pushLeafSummary(
    node: RawSummaryData,
    messageIdList: string[]
  ): Promise<SummaryNode> {
    let summaryModel: SummaryModel | null = null;

    await this.database.write(async () => {
      // Create the leaf summary
      summaryModel = await this.database.get<SummaryModel>("summaries").create(
        (summary) => {
          summary.chatId = node.chatId;
          summary.summary = node.summary;
          summary.summaryType = "leaf";
          summary.size = node.size;
          summary.index = node.index;
          // left/right remain null for leaf
        }
      );

      if (!summaryModel) {
        throw new Error("Failed to save leaf summary");
      }

      // Link messages to this leaf
      const summaryMessageCollection =
        this.database.get<SummaryMessageModel>("summary_messages");

      for (const messageId of messageIdList) {
        await summaryMessageCollection.create((link) => {
          link.summaryId = summaryModel!.id;
          link.messageId = messageId;
        });
      }

      await this.database.get<SummaryStackItemModel>('summary_stack_items')
        .create(
          stack_item => {
            stack_item.chatId = node.chatId,
            stack_item.summaryId = summaryModel!.id
          }
        );
    });

    if (!summaryModel) {
      throw new Error("Failed to save leaf summary to DB");
    }

    const summaryNode = await this.toSummaryNode(summaryModel);
    return summaryNode;
  }
  /**
   * Converts a SummaryModel to a fully hydrated SummaryNode.
   * If left/right children exist, they are fetched from the DB recursively.
   */
  private async toSummaryNode(model: SummaryModel): Promise<SummaryNode> {
    let leftChild: SummaryNode | undefined;
    let rightChild: SummaryNode | undefined;

    if (model.leftSummaryId) {
      const leftModel = await this.database
        .get<SummaryModel>("summaries")
        .find(model.leftSummaryId)
        .catch(() => null);
      if (leftModel) {
        leftChild = await this.toSummaryNode(leftModel); // recursive load
      }
    }

    if (model.rightSummaryId) {
      const rightModel = await this.database
        .get<SummaryModel>("summaries")
        .find(model.rightSummaryId)
        .catch(() => null);
      if (rightModel) {
        rightChild = await this.toSummaryNode(rightModel); // recursive load
      }
    }

    return new SummaryNode({
      id: model.id,
      chatId: model.chatId,
      index: model.index,
      size: model.size,
      summary: model.summary,
      type: model.summaryType as NodeType,
      leftChild,
      rightChild,
    });
  }

  /**
   * Example usage in getStackItems
   */
  async getStackItems(chatId: string): Promise<SummaryNode[]> {
    const stackItems = await this.database
      .get<SummaryStackItemModel>("summary_stack_items")
      .query(Q.where("chat_id", chatId))
      .fetch();

    if (stackItems.length === 0) return [];

    const summaryIds = stackItems.map((item) => item.summaryId);

    const summaries = await this.database
      .get<SummaryModel>("summaries")
      .query(Q.where("id", Q.oneOf(summaryIds)))
      .fetch();

    // Sort by size descending, then by createdAt ascending
    summaries.sort((a, b) => {
      if (b.size !== a.size) return b.size - a.size;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    // Map to SummaryNode with children loaded
    const nodes: SummaryNode[] = [];
    for (const s of summaries) {
      const node = await this.toSummaryNode(s);
      nodes.push(node);
    }

    return nodes;
  }

  async popSummaryNode(node: SummaryNode) {
    await this.database.write( async () => {
      const summaryItem = await this.database.get<SummaryStackItemModel>("summary_stack_items").find(node.id);
      await summaryItem.destroyPermanently();
    });
  }
}

export default SummaryStackDBService;