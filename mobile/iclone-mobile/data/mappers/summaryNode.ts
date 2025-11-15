import NodeType from "@/domain/types/nodeTypes";
import SummaryNode from "../application/SummaryNode";
import SummaryModel from "../database/models/summaryModel";

/**
 * Maps a SummaryModel to a SummaryNode without loading children.
 * Useful for operations where we only need the node itself,
 * not the fully-hydrated tree.
 */
export function toSummaryNodeShallow(model: SummaryModel): SummaryNode {
  return new SummaryNode({
    id: model.id,
    chatId: model.chatId,
    index: model.index,
    size: model.size,
    summary: model.summary,
    type: model.summaryType as NodeType,
    leftChild: undefined,   // Not loaded
    rightChild: undefined,  // Not loaded
  });
}


