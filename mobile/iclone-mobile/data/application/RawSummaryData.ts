import SummaryNode from "@/data/application/SummaryNode";
import NodeType from "@/domain/types/nodeTypes";

export interface RawSummaryDataProps {
  chatId: string;
  index: number;
  size: number;
  summary: string;
  type: NodeType;
  leftChild?: SummaryNode;
  rightChild?: SummaryNode;
}

// SummaryNode unique identifier: Composite key (chatId + index + type)
class RawSummaryData {
  chatId: string;
  index: number;
  size: number;
  summary: string;
  type: NodeType;
  leftChild?: SummaryNode;
  rightChild?: SummaryNode;

  constructor({
    chatId,
    index,
    size,
    summary,
    type,
    leftChild,
    rightChild,
  }: RawSummaryDataProps) {
    this.chatId = chatId;
    this.index = index;
    this.size = size;
    this.summary = summary;
    this.type = type;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }
}

export default RawSummaryData;