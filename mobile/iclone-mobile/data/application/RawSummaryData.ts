import SummaryNode from "@/data/application/SummaryNode";
import NodeType from "@/domain/types/nodeTypes";

interface RawSummaryDataProps {
  chatId: string,
  index: number; 
  size: number;
  summary: string;
  type: NodeType;
  leftChild?: SummaryNode;
  rightChild?: SummaryNode;
}

// SummaryNode unique identifier: Composit key(chatId + index + type)
class RawSummaryData {
  chatId: string;
  index: number;
  size: number;
  summary: string;
  // left and right children are SummaryNodes as they are already saved in the db
  leftChild?: SummaryNode;
  rightChild?: SummaryNode;
  type: NodeType;

  constructor({ chatId, index, size, summary, type, leftChild, rightChild }: RawSummaryDataProps) {
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