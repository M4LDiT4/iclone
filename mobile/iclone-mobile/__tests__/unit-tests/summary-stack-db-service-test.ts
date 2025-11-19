import SummaryStackDBService from '@/services/localDB/summaryStackDBService';
import SummaryModel from '@/data/database/models/summaryModel';
import RawSummaryData from '@/data/application/RawSummaryData';
import { toSummaryNodeShallow } from '@/data/mappers/summaryNode';

jest.mock('@/data/mappers/summaryNode', () => ({
  toSummaryNodeShallow: jest.fn(),
}));

const mockCreate = jest.fn();
const mockQuery = jest.fn();
const mockFetch = jest.fn();
const mockUpdate = jest.fn();
const mockFind = jest.fn();
const mockWrite = jest.fn();

const mockCollection = {
  create: mockCreate,
  query: mockQuery,
  fetch: mockFetch,
  find: mockFind,
};

const mockDatabase: any = {
  get: jest.fn(() => mockCollection),
  write: mockWrite,
};

describe('SummaryStackDBService', () => {
  let service: SummaryStackDBService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SummaryStackDBService(mockDatabase);
  });

  describe('pushLeafSummary', () => {
    it('saves leaf summary and links messages', async () => {
      const node = new RawSummaryData({
        chatId: 'chat-1',
        summary: 'Leaf summary',
        size: 3,
        index: 0,
        type: 'leaf',
      });

      const messageIds = ['m1', 'm2'];
      const mockSummaryModel = {
        id: 's1',
        chatId: node.chatId,
        summary: node.summary,
        size: node.size,
        index: node.index,
        summaryType: node.type,
        createdAt: new Date(),
      } as unknown as SummaryModel;

      mockWrite.mockImplementation(async fn => await fn());
      mockCreate.mockImplementationOnce(fn => {
        const record: any = {};
        fn(record);
        return mockSummaryModel;
      });
      mockCreate.mockImplementation(fn => {
        const record: any = {};
        fn(record);
        return record;
      });

      (toSummaryNodeShallow as jest.Mock).mockReturnValue({ id: 's1' });

      const result = await service.pushLeafSummary(node, messageIds);
      expect(result).toEqual({ id: 's1' });
      expect(mockCreate).toHaveBeenCalledTimes(1 + messageIds.length + 1);
    });
  });

  describe('pushSummaryNode', () => {
    it('saves node and pushes to stack', async () => {
      const node = new RawSummaryData({
        chatId: 'chat-1',
        summary: 'Node summary',
        size: 5,
        index: 1,
        type: 'node',
      });

      const mockSummaryModel = {
        id: 'n1',
        chatId: node.chatId,
        summary: node.summary,
        size: node.size,
        index: node.index,
        summaryType: node.type,
        createdAt: new Date(),
      } as unknown as SummaryModel;

      mockWrite.mockImplementation(async fn => await fn());
      mockCreate.mockImplementationOnce(fn => {
        const record: any = {};
        fn(record);
        return mockSummaryModel;
      });
      mockCreate.mockImplementation(fn => {
        const record: any = {};
        fn(record);
        return record;
      });

      (toSummaryNodeShallow as jest.Mock).mockReturnValue({ id: 'n1' });

      const result = await service.pushSummaryNode(node, 'node');
      expect(result).toEqual({ id: 'n1' });
      expect(mockCreate).toHaveBeenCalledTimes(2);
    });
  });

  describe('getNewLeafIndex / getNewNodeIndex', () => {
    it('returns 0 if no leaf summaries found', async () => {
      mockQuery.mockReturnValue({ fetch: mockFetch });
      mockFetch.mockResolvedValue([]);
      const result = await service.getNewLeafIndex('chat-1');
      expect(result).toBe(0);
    });

    it('returns next leaf index based on latest', async () => {
      mockQuery.mockReturnValue({ fetch: mockFetch });
      mockFetch.mockResolvedValue([{ index: 3 }]);
      const result = await service.getNewLeafIndex('chat-1');
      expect(result).toBe(4);
    });

    it('returns next node index based on latest', async () => {
      mockQuery.mockReturnValue({ fetch: mockFetch });
      mockFetch.mockResolvedValue([{ index: 7 }]);
      const result = await service.getNewNodeIndex('chat-1');
      expect(result).toBe(8);
    });
  });

  describe('getStackItems', () => {
    it('returns sorted summary nodes', async () => {
      const stackItems = [{ summaryId: 's1' }, { summaryId: 's2' }];
      const summaries = [
        { id: 's1', size: 2, createdAt: new Date('2023-01-01') },
        { id: 's2', size: 5, createdAt: new Date('2023-01-02') },
      ] as unknown as SummaryModel[];

      mockQuery.mockReturnValueOnce({ fetch: jest.fn().mockResolvedValue(stackItems) });
      mockQuery.mockReturnValueOnce({ fetch: jest.fn().mockResolvedValue(summaries) });

      (toSummaryNodeShallow as jest.Mock).mockImplementation(s => ({ id: s.id }));

      const result = await service.getStackItems('chat-1');
      expect(result).toEqual([{ id: 's2' }, { id: 's1' }]);
    });
  });

  describe('upsertSummaryStack', () => {
    it('updates existing stack summary', async () => {
      const existing = { id: 'stack1', update: mockUpdate };
      mockWrite.mockImplementation(async fn => await fn());
      mockQuery.mockReturnValueOnce(Promise.resolve([existing]));

      const result = await service.upsertSummaryStack('chat-1', 'Updated summary');
      expect(mockUpdate).toHaveBeenCalled();
      expect(result).toBe(existing);
    });

    it('creates new stack summary if none exists', async () => {
      const newSummary = { id: 'newStack' };
      mockWrite.mockImplementation(async fn => await fn());
      mockQuery.mockReturnValueOnce(Promise.resolve([]));
      mockCreate.mockImplementation(fn => {
        const record: any = {};
        fn(record);
        return newSummary;
      });

      const result = await service.upsertSummaryStack('chat-1', 'New summary');
      expect(result).toBe(newSummary);
    });
  });
});