import NodeType from "../../domain/types/nodeTypes";

interface SummaryNodeProps {
  id: string; // required
  chatId: string;
  index: number; 
  size: number;
  summary: string;
  type: NodeType;
  leftChild?: SummaryNode;
  rightChild?: SummaryNode;
}

// SummaryNode unique identifier: Composite key(chatId + index + type)
class SummaryNode {
  id: string;
  chatId: string;
  index: number;
  size: number;
  summary: string;
  leftChild?: SummaryNode;
  rightChild?: SummaryNode;
  type: NodeType;

  constructor({ id, chatId, index, size, summary, type, leftChild, rightChild }: SummaryNodeProps) {
    this.id = id; // always set
    this.chatId = chatId;
    this.index = index;
    this.size = size;
    this.summary = summary;
    this.type = type;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }
}

export default SummaryNode;
