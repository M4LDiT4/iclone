import SummaryMessageModel from "@/data/database/models/summaryMessageModel";
import SummaryModel from "@/data/database/models/summaryModel";
import SummaryStackItemModel from "@/data/database/models/summaryStackItemModel";
import SummaryNode from "@/data/application/SummaryNode";
import SummaryType from "@/domain/types/summaryTypes";
import { Database, Q } from "@nozbe/watermelondb";
import RawSummaryData from "@/data/application/RawSummaryData";
import {toSummaryNodeShallow } from "@/data/mappers/summaryNode";

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
      ).fetch();

    if (leaves.length === 0) return 0;
    return leaves[0].index + 1;
  }

  async getNewNodeIndex(chatId: string): Promise<number> {
    const nodes = await this.database.get<SummaryModel>('summaries')
      .query(
        Q.where('chat_id', chatId), 
        Q.where("summary_type", "node"),
        Q.sortBy('created_at', Q.desc)
      ).fetch();

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

    const summaryNode = await toSummaryNodeShallow(summaryModel);
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

    const summaryNode = toSummaryNodeShallow(summaryModel);
    return summaryNode;
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
      const node = toSummaryNodeShallow(s);
      nodes.push(node);
    }

    return nodes;
  }

  async popSummaryNode(node: SummaryNode) {
    await this.database.write( async () => {
      const summaryItem = await this.database.get<SummaryStackItemModel>(SummaryStackItemModel.table).find(node.id);
      await summaryItem.destroyPermanently();
    });
  }

  async upsertSummaryStack(chatId: string, summary: string){
    return await this.database.write(
      async () => {
        let existing: SummaryModel | null;
        try{
          const chatIdSummaries  = await this.database.get<SummaryModel>(SummaryModel.table).query(
            Q.where("chat_id", chatId),
            Q.where("summary_type", "stack")
          )

          if(chatIdSummaries.length != 1){
            existing = null;
          } else{
            existing = chatIdSummaries[0];
          }
        }catch(err){
          console.log(`Failed to find the summary for chatId ${chatId}: ${err}`);
          existing = null;
        }

        if(existing){
          await existing.update(record => {
            record['summary'] = summary
          });

          return existing;
        }else{
          const stackSummary = await this.database.get<SummaryModel>(SummaryModel.table)
            .create( sum => {
              sum.chatId = chatId,
              sum.summary = summary,
              sum.summaryType = 'stack',
              sum.size = 0,
              sum.index = 0
            }
          )

          return stackSummary;
        }
      }
    )
  }

  async getSummary(chatId: string): Promise<SummaryModel | null> {
    const summary = await this.database.get<SummaryModel>(SummaryModel.table)
                    .query(
                      Q.where('chat_id', chatId),
                      Q.where("summary_type", 'stack')
                    );
    if(summary.length != 1){
      return null;
    }
    return summary[0];
  }
}

export default SummaryStackDBService;