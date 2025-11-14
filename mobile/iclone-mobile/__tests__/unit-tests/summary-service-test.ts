import DeepSeekClient from '@/domain/llm/deepSeek/model';
import { SummaryServiceError } from '@/core/errors/SummaryServiceError';
import SummaryService from '@/services/SummaryService';

jest.mock('@/domain/llm/deepSeek/model');

const mockCall = jest.fn();
(DeepSeekClient as jest.Mock).mockImplementation(() => ({
  call: mockCall,
}));

describe('SummaryService', () => {
  let service: SummaryService;

  beforeEach(() => {
    const mockClient = new DeepSeekClient('fake-api-key');
    service = new SummaryService(mockClient);
    jest.clearAllMocks();
  });

  describe('summarizePair', () => {
    it('throws SummaryServiceError if left or right is empty', async () => {
      await expect(service.summarizePair('', 'B')).rejects.toThrow(SummaryServiceError);
      await expect(service.summarizePair('A', '')).rejects.toThrow(SummaryServiceError);
    });

    it('calls llmClient with merged prompt and returns response', async () => {
      mockCall.mockResolvedValue('Merged summary');
      const result = await service.summarizePair('A', 'B');
      expect(result).toBe('Merged summary');
      expect(mockCall).toHaveBeenCalledWith(expect.stringContaining('Summary A: A'));
      expect(mockCall).toHaveBeenCalledWith(expect.stringContaining('Summary B: B'));
    });
  });

  describe('summarizeConversation', () => {
    it('throws SummaryServiceError if conversation is empty', async () => {
      await expect(service.summarizeConversation('')).rejects.toThrow(SummaryServiceError);
    });

    it('calls llmClient with conversation prompt and returns response', async () => {
      mockCall.mockResolvedValue('Conversation summary');
      const result = await service.summarizeConversation('User and assistant discussed goals.');
      expect(result).toBe('Conversation summary');
      expect(mockCall).toHaveBeenCalledWith(expect.stringContaining('Conversation:'));
    });
  });
});