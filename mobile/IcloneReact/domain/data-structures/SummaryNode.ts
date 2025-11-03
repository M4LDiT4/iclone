type NodeType = 'leaf' | 'node';

interface SummaryNodeProps {
  index: number;
  size: number;
  summary: string;
  type: NodeType;
  leftChild?: SummaryNode;
  rightChild?: SummaryNode;
}

class SummaryNode {
  index: number;
  size: number;
  summary: string;
  leftChild?: SummaryNode;
  rightChild?: SummaryNode;
  type: NodeType;

  constructor({ index, size, summary, type, leftChild, rightChild }: SummaryNodeProps) {
    this.index = index;
    this.size = size;
    this.summary = summary;
    this.type = type;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }
}

export default SummaryNode;