import { SummaryServiceError } from "@/core/errors/SummaryServiceError";
import DeepSeekClient from "@/domain/llm/deepSeek/model";

class SummaryService {
  llmClient: DeepSeekClient;
  constructor(llmClient: DeepSeekClient){
    this.llmClient = llmClient; 
  }

  async summarizePair(left: string, right: string): Promise<string> {
    if(left.length === 0 || right.length === 0){
      throw new SummaryServiceError("[Merge Summarization Failed]", "`left` or `right` string is empty");
    }
    const prompt = `
      Task: Merge the following two summaries into a single, concise long-term memory summary.

      Goal: Preserve essential context, decisions, and preferences while eliminating redundancy. The result should support continuity, personalization, and future recall.

      Instructions:

      Identify overlapping ideas and unify them logically.

      Retain unique insights, facts, or decisions from each summary.

      Abstract where possible, but preserve concrete details that support future relevance.

      Maintain consistency in tone and perspective (assistant’s memory context).

      Limit to ~150 words or 8–10 bullet points for readability.

      Include:

      People & roles

      Topics & key decisions

      Purpose & motivation

      Context of application

      Next steps or ongoing preferences

      Emotional tone or relational cues

      Input Summaries:
      Summary A: ${left}
      Summary B: ${right}
    `;

    const response = await this.llmClient.call(prompt);
    return response;
  }

  async summarizeConversation(conversation: string): Promise<string> {
    if(conversation.length === 0){
      throw new SummaryServiceError("[Conversation Summarization Failed]", "Conversation is empty");
    }
    const prompt =  `
    Task: Summarize this conversation for long-term memory.
    Goal: Capture essential context to help future interactions feel continuous, relevant, and personalized.

    Include:

    People & roles: Who was involved or referenced.

    Topics & decisions: What was discussed, clarified, or decided.

    Purpose & motivation: Why it matters — the underlying goal or problem being solved.

    Context of application: Where or in what project/situation this applies.

    Next steps or preferences: How the user wants to proceed, follow up, or be supported in the future.

    Tone & emotional state: Brief note on the user’s emotional tone or attitude (e.g., curious, confident, frustrated).

    Style:
    Write concisely in bullet or structured paragraph form. Focus on meaning, not verbatim detail.

    Conversation:
      ${conversation}
    `

    const response = await this.llmClient.call(prompt);
    return response;
  }
}

export default SummaryService;