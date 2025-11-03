import Stack from "./Stack";
import SummaryNode from "./SummaryNode";

class SummaryStack {
  private stack = new Stack<SummaryNode>();

  constructor(
    private getLeafIndex: () => Promise<number>,
    private getNodeIndex: () => Promise<number>,
    private summarizePair: (left: string, right: string) => string
  ) {}

  async pushLeaf(summary: string): Promise<void> {
    const leaf = new SummaryNode({
      index: await this.getLeafIndex(),
      size: 1,
      summary,
      type: 'leaf',
    });

    this.stack.push(leaf);
    this.mergeIfNeeded();
  }

  private async mergeIfNeeded(): Promise<void> {
    while (
      this.stack.size() >= 2 &&
      this.stack.peek()!.size === this.stackItems()[this.stack.size() - 2].size
    ) {
      const right = this.stack.pop()!;
      const left = this.stack.pop()!;
      const mergedSummary = this.summarizePair(left.summary, right.summary);

      const parent = new SummaryNode({
        index:await this.getNodeIndex(),
        size: left.size + right.size,
        summary: mergedSummary,
        type: 'node',
        leftChild: left,
        rightChild: right,
      });

      this.stack.push(parent);
    }
  }

  async summarizeStack(): Promise<string> {
    if (this.stack.isEmpty()) return '';
    if (this.stack.size() === 1) return this.stack.peek()!.summary;

    while (this.stack.size() > 1) {
      const right = this.stack.pop()!;
      const left = this.stack.pop()!;
      const mergedSummary = this.summarizePair(left.summary, right.summary);

      const parent = new SummaryNode({
        index: await this.getNodeIndex(),
        size: left.size + right.size,
        summary: mergedSummary,
        type: 'node',
        leftChild: left,
        rightChild: right,
      });

      this.stack.push(parent);
    }

    return this.stack.peek()!.summary;
  }

  getStack(): SummaryNode[] {
    return this.stackItems();
  }

  private stackItems(): SummaryNode[] {
    // Accessing internal items safely
    return [...(this.stack as any).items];
  }
}