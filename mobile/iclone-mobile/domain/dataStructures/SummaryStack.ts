import Stack from "./Stack";
import SummaryNode from "../../data/application/SummaryNode";
import SummaryService from "@/services/SummaryService";
import RawSummaryData from "@/data/application/RawSummaryData";
import { LocalDBError } from "@/core/errors/LocalDBError";
import ServiceError from "@/core/errors/ServiceError";
import { LLMError } from "@/core/errors/LLMError";
import SummaryStackDBService from "@/services/localDB/SummaryStackDatabaseService";

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


  async initialize(){
    const stackItems = await this.summaryStackDBService.getStackItems(this.chatId);
    for(var item of stackItems){
      this.stack.push(item);
    }
  }
  /** ## Handles insertion of new sliding window summary to the summary stack
   * @param summary : summary of the sliding window
   * @param messageIdList : the id of messages that is used to generate the summary. We can use this to rebuild the summary stack from scratch 
   */
  async pushLeaf(summary: string, messageIdList: string []): Promise<void> {
    try{
      const leaf = new RawSummaryData({
        chatId: this.chatId,
        index: await this.summaryStackDBService.getNewLeafIndex(this.chatId),
        size: 1,
        summary,
        type: 'leaf',
      });
      
      const summaryNode = await this.summaryStackDBService.pushLeafSummary(leaf, messageIdList);

      this.stack.push(summaryNode);
      // merges the stack to keep only few items on the summary stack
      await this.mergeIfNeeded();

      // for each push of a node/leaf we need to summarize the stack
      const stackSummary = await this.summarizeStack();
      await this.summaryStackDBService.upsertSummaryStack(this.chatId, stackSummary);
    }catch(err){
      if(err instanceof LocalDBError){
        console.error(`Local Database error encountered while trying to push leaf: ${err}`);
        throw err;
      }
      console.error(`Unexpected error occured while trying to push leaf to summary stack: ${err}`);
      throw new ServiceError("Unexpected error occured while trying to push leaf to summary stack");
    }
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
    try{
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
        // we start summarizing from the top of the stack
        // we pop two items, merge them, push the result to the stack
        // repeat the process
        this.stack.push(summaryNode);
      }
    }catch(err){
      if(err instanceof LocalDBError){
        console.error(`Local Database error occured while merging summary summary stack: ${err}`);
        throw err;
      }else if(err instanceof LLMError){
        console.error(`LLM error encountered while merging summary stack: ${err}`);
        throw err;
      }
      console.error(`Unexpected error occured while merging summary stack: ${err}`);
      throw new ServiceError("Unexpected error occured while merging summary stack");
    }
  }
  /**
   * Summarizes the summary stack to a single node
   * If there is only one node on the stack, returns the summary/content of that node
   * We only summarizes the stack, we do not save the summary here
   * @returns [string]: summary of the stack
   */
  async summarizeStack(): Promise<string> {
    try{
      const items = [...this.getStack()];
      const temp: SummaryNode[] = [...items];
      // merges the stack until only one node left
      while (temp.length > 1) {
        const right = temp.pop()!;
        const left = temp.pop()!;
        const merged = await this.summaryService.summarizePair(left.summary, right.summary);

        temp.push({
          ...left,
          size: left.size + right.size,
          summary: merged
        });
      }
      // return the summary of the remaining node
      return temp[0].summary;
    }catch(err){
      if(err instanceof LocalDBError){
        console.error(`Local database error encountered while summarizing stack: ${err}`);
        throw err;
      }else if(err instanceof LLMError){
        console.error(`LLM error encountered while summarizing stack: ${err}`);
        throw err;
      }
      console.error(`Unexpected error occured while summarizing stack: ${err}`);
      throw new ServiceError("Unexpected error occured while summarizing stack");
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