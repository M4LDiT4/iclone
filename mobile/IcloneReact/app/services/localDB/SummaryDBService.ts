import SummaryNode from "@/app/domain/data-structures/SummaryNode";

class SummaryDBService {

  async getNewLeafIndex(chatId: string): Promise<number> {
    // return the the new index for a leaf
    // idea is to get the latest index for a leaf associated with the chat id
    // that index + 1
    // 0 if there is no leaf for that chatId
    return 0;
  }

  async getNewNodeIndex(chatId: String): Promise<number> {
    // return the new index for a node
    // idea is to get the latest index for a node associated with the chat id
    // that index + 1
    // 0 if there is no node for that chatId
    return 0;
  }

  async pushSummaryNode(node: SummaryNode) {
    // save the node to Summary Node table
    // save a reference to the Summary Stack 
  }

  async popSummaryNode(node: SummaryNode) {
    // remove the Summary node  from the Summary Stack table
  }
}

export default SummaryDBService;