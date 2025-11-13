import Stack from "./Stack";
import SummaryNode from "../../data/application/SummaryNode";
import SummaryService from "@/services/SummaryService";
import SummaryStackDBService from "@/services/localDB/summaryStackDBService";
import RawMessageData from "@/data/application/RawMessage";
import RawSummaryData from "@/data/application/RawSummaryData";

interface SummaryStackProps {
  summaryStackDBService: SummaryStackDBService;
  summaryService: SummaryService;
  chatId: string;
}

class SummaryStack {
  private stack = new Stack<SummaryNode>();

  chatId: string;
  summaryStackDBService: SummaryStackDBService;
  summaryService: SummaryService;

  constructor(props: SummaryStackProps) {
    this.summaryStackDBService = props.summaryStackDBService;
    this.summaryService = props.summaryService;
    this.chatId = props.chatId;
  }


  async intialize(){
    const stackItems = await this.summaryStackDBService.getStackItems(this.chatId);
    for(var item of stackItems){
      this.stack.push(item);
    }
  }

  async pushLeaf(summary: string, messageIdList: string []): Promise<void> {
    const leaf = new RawSummaryData({
      chatId: this.chatId,
      index: await this.summaryStackDBService.getNewLeafIndex(this.chatId),
      size: 1,
      summary,
      type: 'leaf',
    });
    
    const summaryNode = await this.summaryStackDBService.pushLeafSummary(leaf, messageIdList);

    this.stack.push(summaryNode);
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

      const parent = new RawSummaryData({
        chatId: this.chatId,
        index: await this.summaryStackDBService.getNewNodeIndex(this.chatId),
        size: left.size + right.size,
        summary: mergedSummary,
        type: 'node', // this means that it is not a summary of messages but summary of summaries
        // keeps track of the nodes that composes the current node's summaries
        // can be used to rebuild the stack on memory
        // remove this if this module is heavy, serves no real purpose as of the moment
        leftChild: left, 
        rightChild: right,
      });

      const summaryNode = await this.summaryStackDBService.pushSummaryNode(parent, "node");

      this.stack.push(summaryNode);
    }
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