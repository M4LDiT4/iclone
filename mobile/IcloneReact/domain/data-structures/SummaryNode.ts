type NodeType = 'leaf' | 'node';

interface SummaryNodeProps {
  chatId: string,
  index: number;
  size: number;
  summary: string;
  type: NodeType;
  leftChild?: SummaryNode;
  rightChild?: SummaryNode;
}

// SummaryNode unique identifier: Composit key(chatId + index + type)
class SummaryNode {
  chatId: string;
  index: number;
  size: number;
  summary: string;
  leftChild?: SummaryNode;
  rightChild?: SummaryNode;
  type: NodeType;

  constructor({ chatId, index, size, summary, type, leftChild, rightChild }: SummaryNodeProps) {
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