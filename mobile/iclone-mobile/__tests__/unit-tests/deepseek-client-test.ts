import axios from 'axios';
import DeepSeekClient from '@/domain/llm/deepSeek/model';
import { LLMError } from '@/core/errors/LLMError';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DeepSeekClient', () => {
  const apiKey = 'test-api-key';
  let client: DeepSeekClient;

  beforeEach(() => {
    client = new DeepSeekClient(apiKey);
    jest.clearAllMocks();
  });

  it('returns content from successful response', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        choices: [
          { message: { content: 'Mocked LLM response' } }
        ]
      }
    });

    const result = await client.call('Summarize this');
    expect(result).toBe('Mocked LLM response');
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        prompt: 'Summarize this',
        stream: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
  });

  it('returns fallback string if response is missing content', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        choices: [{}] // no message.content
      }
    });

    const result = await client.call('Prompt with no content');
    expect(result).toBe('No response content');
  });

  it('throws LLMError on API failure', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Network error'));

    await expect(client.call('Failing prompt')).rejects.toThrow(LLMError);
    await expect(client.call('Failing prompt')).rejects.toThrow('Failed to call DeepSeek API');
  });
});