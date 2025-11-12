import SummaryDBService from "@/services/localDB/SummaryDBService";
import Stack from "./Stack";
import SummaryNode from "./SummaryNode";
import SummaryService from "@/services/SummaryService";

interface SummaryStackProps {
  summaryDBService: SummaryDBService;
  summaryService: SummaryService;
  chatId: string;
}

class SummaryStack {
  private stack = new Stack<SummaryNode>();

  chatId: string;
  summaryDBService: SummaryDBService;
  summaryService: SummaryService;

  constructor(props: SummaryStackProps) {
    this.summaryDBService = props.summaryDBService;
    this.summaryService = props.summaryService;
    this.chatId = props.chatId;
  }


  async intialize(){
    // check the summary stack table for nodes/leaves associated with the chat id
    // create a summary stack out of it (sort by size)
  }

  async pushLeaf(summary: string): Promise<void> {
    const leaf = new SummaryNode({
      chatId: this.chatId,
      index: await this.summaryDBService.getNewLeafIndex(this.chatId),
      size: 1,
      summary,
      type: 'leaf',
    });
    
    await this.summaryDBService.pushSummaryNode(leaf, 'leaf');

    this.stack.push(leaf);
    this.mergeIfNeeded();
  }

  /**
   * Keeps the summary stack short and concise
   * 
   * If the 2 topmost item on the stack has the same size,
   * pop the two topmost item, combine their summary and summarize it.
   * Inserts the summary as a new node at the top of the stack
   * 
   * repeat the process until stack has length of 1 or the two topmost items
   * do not have the same size
   */
  private async mergeIfNeeded(): Promise<void> {
    while (
      this.stack.size() >= 2 &&
      this.stack.peek()!.size === this.stackItems()[this.stack.size() - 2].size
    ) {

      // pops the two topmost items
      const right = this.stack.pop()!;
      const left = this.stack.pop()!;
      // summarize their summaries
      const mergedSummary = await this.summaryService.summarizePair(left.summary, right.summary);

      const parent = new SummaryNode({
        chatId: this.chatId,
        index: await this.summaryDBService.getNewNodeIndex(this.chatId),
        size: left.size + right.size,
        summary: mergedSummary,
        type: 'node', // this means that it is not a summary of messages but summary of summaries
        // keeps track of the nodes that composes the current node's summaries
        // can be used to rebuild the stack on memory
        // remove this if this module is heavy, serves no real purpose as of the moment
        leftChild: left, 
        rightChild: right,
      });

      await this.summaryDBService.pushSummaryNode(parent, "node");

      this.stack.push(parent);
    }
  }
  // NOTE: this results to a stack with one item
  // converges the nodes to a single tree
  // use this with caution
  // if you want to get the summary of the stack without changing
  // the structure of the stack, use `getStackSummary`
  async summarizeStack(): Promise<string> {
    if (this.stack.isEmpty()) return '';
    if (this.stack.size() === 1) return this.stack.peek()!.summary;

    while (this.stack.size() > 1) {
      const right = this.stack.pop()!;
      const left = this.stack.pop()!;
      const mergedSummary = await this.summaryService.summarizePair(left.summary, right.summary);

      const parent = new SummaryNode({
        chatId: this.chatId,
        index: await this.summaryDBService.getNewNodeIndex(this.chatId),
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

  async getStackSummary(): Promise<string> {
    if (this.stack.isEmpty()) return '';
    if (this.stack.size() === 1) return this.stack.peek()!.summary;

    while (this.stack.size() > 1) {
      const right = this.stack.pop()!;
      const left = this.stack.pop()!;
      const mergedSummary = await  this.summaryService.summarizePair(left.summary, right.summary);

      const parent = new SummaryNode({
        chatId: this.chatId,
        index: await this.summaryDBService.getNewNodeIndex(this.chatId),
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

export default SummaryStack;