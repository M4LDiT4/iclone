import axios from 'axios';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

class DeepSeekClient {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.deepseek.com/chat/completions';
  private readonly model: string = 'deepseek-chat';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private constructPrompt(userInput: string): ChatMessage[] {
    return [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: userInput },
    ];
  }

  public async call(userInput: string): Promise<string> {
    const messages = this.constructPrompt(userInput);

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
      return 'Error calling DeepSeek API';
    }
  }
}

export default DeepSeekClient;