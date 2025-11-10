import DeepSeekClient from "@/domain/llm/deepSeek/model";

class SummaryService {
  llmClient: DeepSeekClient;
  constructor(llmClient: DeepSeekClient){
    this.llmClient = llmClient; 
  }

  async summarizePair(left: string, right: string): Promise<string> {
    // create a prompt to summarize the two strings
    return "summary of left and right";
  }

  async summarize(content: string): Promise<string> {
    return "summary of content";
  }
}

export default SummaryService;