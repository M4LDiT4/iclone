import { SummaryServiceError } from "@/core/errors/SummaryServiceError";
import DeepSeekClient, { DeepSeekMessageStructure } from "@/domain/llm/deepSeek/model";


export interface HighLevelChatSummary {
  tag: string[],
  title: string,
  summary: string,
  narrative: string
}

class SummaryService {
  llmClient: DeepSeekClient;

  constructor(llmClient: DeepSeekClient) {
    this.llmClient = llmClient;
  }

  async summarizePair(left: string, right: string): Promise<string> {
    if (!left || !right) {
      throw new SummaryServiceError("[Merge Summarization Failed]", "`left` or `right` string is empty");
    }

    const systemPrompt = `
      Task: Merge Summary A and Summary B into one concise long-term memory summary.

      Goal: Preserve all meaningful, future-relevant information that helps reconstruct the user’s story in their voice.

      Include (merge these fields if present):
      - User Intent
      - Key Events (from user perspective)
      - User Tone/Emotion
      - User Voice/Style
      - Important Facts / Story Details
      - User Opinions/Beliefs
      - Decisions/Realizations
      - Next Steps or Ongoing Plans

      Rules:
      - Keep only essential content; remove redundancy.
      - Preserve unique details and user identity markers (style, motivations).
      - Maintain a consistent structure.
      - Limit to ~150 words OR 8–12 bullet points.

      Summary A: ${left}
      Summary B: ${right}
    `.trim();

    const messages: DeepSeekMessageStructure[] = [
      { role: 'system', content: systemPrompt }
    ];

    const response = await this.llmClient.call(messages);
    return response;
  }

  async summarizeConversation(conversation: string): Promise<string> {
    if (!conversation) {
      throw new SummaryServiceError("[Conversation Summarization Failed]", "Conversation is empty");
    }

    const systemPrompt = `
      Task: Summarize the conversation into a structured long-term memory entry that supports future reconstruction in the user's voice.

      Extract the following fields:

      - User Intent: Why the user is engaging or what they aim to achieve.
      - Key Events (User Perspective): What the user expressed, did, or focused on.
      - User Tone/Emotion: 1–2 words capturing mood.
      - User Voice/Style: How the user tends to speak (casual, direct, playful, detailed, etc.).
      - Important Facts: Story details, personal info, preferences, constraints.
      - User Opinions/Beliefs: Meaningful positions or preferences.
      - Decisions/Realizations: Any changes, commitments, or conclusions.
      - Next Steps: What the user wants to do next or expects.

      Style:
      - Use bullet points or a clean structured block.
      - Do NOT include verbatim dialogue.
      - Focus on meaning, perspective, and reconstructable details.

      Conversation:
      ${conversation}
    `.trim();

    const messages: DeepSeekMessageStructure[] = [
      { role: 'system', content: systemPrompt }
    ];

    const response = await this.llmClient.call(messages);
    return response;
  }

  async summarizeNarrative(longtermMemory: string, latestConversation: string):Promise<HighLevelChatSummary> {
    const systemPrompt = `Task: Create a structured memory summary from the provided Long-Term Memory (LTM) and the Current Conversation (STM).  
      The summary must preserve everything required to reconstruct the user's story later in the user's own voice.

      You MUST output valid JSON only.

      Required JSON fields:
      {
        "tag": [string],                      // Short classifier for quick routing (e.g., "family", "work", "personal", "preferences")
        "title": string,                    // Short descriptive title for this memory
        "summary": {                        
          "user_intent": string,            // Why the user is talking or what they want to achieve
          "key_events": [string],           // What happened, from the user’s perspective
          "tone": string,                   // Short emotional descriptor (e.g., "curious", "excited", "frustrated")
          "voice_style": string,            // How the user tends to speak (casual, detailed, direct, sarcastic, etc.)
          "important_facts": [string],      // Story/world/personal facts that must persist
          "opinions_beliefs": [string],     // User’s stated preferences, likes/dislikes, views
          "decisions_realizations": [string], // Commitments, conclusions, or new understanding
          "next_steps": [string]            // What the user wants to do next or expects in future interactions
        },
        "narrative": string                 // A coherent first-person narrative reconstruction of the events and meaning
      }

      

      Instructions:
      - Use both memories (LTM + STM) to build a unified summary.
      - Preserve unique details from each memory source.
      - Keep it concise but reconstructable.
      - Prefer user-perspective framing when describing events.
      - The narrative should read like the user telling their own story naturally, in first person.
      - Never include verbatim dialogue.
      - Do NOT output anything outside the JSON object.
      - Do NOT include code fences, labels, or any text outside the JSON.
      - Do NOT add explanations or commentary.
      - Output must begin with '{' and end with '}'.


      Inputs:
      Long-Term Memory:
      ${longtermMemory}

      Latest Conversation:
      ${latestConversation}
      `
    const messages: DeepSeekMessageStructure[] = [
      { role: 'system', content: systemPrompt }
    ];

    const response = await this.llmClient.call(messages);

    console.log(`Response is: ${response}`);
    const parsedResponse = JSON.parse(response);
    
    if(!parsedResponse){
      console.error(`Parsed conversation summary is null or undefined`);
      throw new SummaryServiceError("Problem generating conversation summary");
    }

    if(typeof parsedResponse === 'object'
      && Array.isArray(parsedResponse.tag)
      && parsedResponse.tag.every((t: any) => typeof t === 'string')
      && typeof parsedResponse.title === 'string'
      && typeof parsedResponse.summary === 'object'
      && typeof parsedResponse.summary !== null
      && typeof parsedResponse.narrative === 'string'
    ){
      const typedResponse: HighLevelChatSummary = {
        title: parsedResponse.title,
        summary: JSON.stringify(parsedResponse.summary),
        tag: parsedResponse.tag,
        narrative: parsedResponse.narrative
      }
      return typedResponse;
    }
    console.error(`Response recieved is not of type  High level chat summary`);
    throw new SummaryServiceError('Failed to generate conversation summary')
  }
}

export default SummaryService;
