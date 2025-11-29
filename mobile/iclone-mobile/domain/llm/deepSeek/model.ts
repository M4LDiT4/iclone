import { LLMError } from '@/core/errors/LLMError';
import axios from 'axios';

export type DeepSeekMessageStructure = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};



class DeepSeekClient {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.deepseek.com/chat/completions';
  private readonly model: string = 'deepseek-chat';

  constructor(apiKey: string) {
    if(!apiKey){
      throw new LLMError("Failed to connect with LLM: No API Key")
    }
    this.apiKey = apiKey;
  }

  public async call(messages: DeepSeekMessageStructure[]): Promise<string> {
    try {
      const response = await axios.post(
        this.baseUrl,
        {
          model: this.model,
          messages,
          stream: false,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data?.choices?.[0]?.message?.content ?? 'No response content';
    } catch (error: any) {
      console.error('DeepSeek API error:', error?.response?.data || error.message);
      throw new LLMError('Failed to call DeepSeek API', error);
    }
  }

}

export default DeepSeekClient;