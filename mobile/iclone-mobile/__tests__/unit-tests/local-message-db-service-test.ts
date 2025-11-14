import LocalMessageDBService from '@/services/localDB/LocalMessageDBService';
import { Q } from '@nozbe/watermelondb';
import MessageModel from '@/data/database/models/messageModel';
import RawMessageData from '@/data/application/RawMessage';

const mockCreate = jest.fn();
const mockQuery = jest.fn();
const mockFetch = jest.fn();
const mockWrite = jest.fn();

const mockCollection = {
  create: mockCreate,
  query: mockQuery,
  fetch: mockFetch,
};

const mockDatabase: any = {
  get: jest.fn(() => mockCollection),
  write: mockWrite,
};

describe('LocalMessageDBService', () => {
  let service: LocalMessageDBService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new LocalMessageDBService(mockDatabase);
  });

  describe('createMessage', () => {
    it('saves message correctly and returns model', async () => {
      const raw: RawMessageData = {
        content: 'Hello',
        sender: 'user',
        chatId: 'chat-1',
      };

      const mockSavedMessage = { id: '1', ...raw } as MessageModel;

      mockWrite.mockImplementation(async (fn: any) => await fn());
      mockCreate.mockImplementation((fn: any) => {
        const msg: any = {};
        fn(msg);
        return mockSavedMessage;
      });

      const result = await service.createMessage(raw);
      expect(result).toEqual(mockSavedMessage);
      expect(mockDatabase.get).toHaveBeenCalledWith('messages');
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  describe('getMessages', () => {
    it('returns correct messages in order with skip/limit', async () => {
      const messages = [
        { id: '3', content: 'C' },
        { id: '2', content: 'B' },
        { id: '1', content: 'A' },
      ] as MessageModel[];

      mockQuery.mockReturnValue({ fetch: mockFetch });
      mockFetch.mockResolvedValue(messages);

      const result = await service.getMessages('chat-1', 2, 1);
      expect(result).toEqual([messages[1], messages[2]]);
      expect(mockDatabase.get).toHaveBeenCalledWith('messages');
      expect(mockQuery).toHaveBeenCalledWith(
        Q.where('chat_id', 'chat-1'),
        Q.sortBy('created_at', Q.desc)
      );
    });

    it('handles empty DB correctly', async () => {
      mockQuery.mockReturnValue({ fetch: mockFetch });
      mockFetch.mockResolvedValue([]);

      const result = await service.getMessages('chat-1', 5);
      expect(result).toEqual([]);
    });

    it('handles skip beyond range', async () => {
      const messages = [
        { id: '1', content: 'A' },
        { id: '2', content: 'B' },
      ] as MessageModel[];

      mockQuery.mockReturnValue({ fetch: mockFetch });
      mockFetch.mockResolvedValue(messages);

      const result = await service.getMessages('chat-1', 2, 5);
      expect(result).toEqual([]);
    });
  });
});