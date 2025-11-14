import SummaryStack from "@/domain/dataStructures/SummaryStack";
import RawMessageData from "@/data/application/RawMessage";
import MessageData from "@/data/application/MessageData";
import ChatService from "@/services/ChatService";
import LocalMessageDBService from "@/services/localDB/LocalMessageDBService";
import SummaryService from "@/services/SummaryService";
import ConversationSlidingWindow from "@/domain/algorithms/ConversationSlidingWindow";

// Mock dependencies
jest.mock("@/services/localDB/LocalMessageDBService");
jest.mock("@/services/SummaryService");
jest.mock("@/domain/dataStructures/SummaryStack");
jest.mock("@/domain/algorithms/ConversationSlidingWindow");

// Safe mock for toMessageData using require
jest.mock('@/data/mappers/messageMapper', () => {
  const MessageData = require('@/data/application/MessageData').default;
  return {
    toMessageData: jest.fn((msg) => new MessageData({
      id: msg.id,
      chatId: msg.chatId,
      content: msg.content,
      sender: msg.sender,
    })),
  };
});

import { toMessageData } from '@/data/mappers/messageMapper';

describe("ChatService", () => {
  let chatService: ChatService;
  let mockLocalMessageDBService: jest.Mocked<LocalMessageDBService>;
  let mockSummaryService: jest.Mocked<SummaryService>;
  let mockSummaryStack: jest.Mocked<SummaryStack>;
  let mockSlidingWindow: jest.Mocked<ConversationSlidingWindow>;

  beforeEach(() => {
    mockLocalMessageDBService = new LocalMessageDBService({} as any) as jest.Mocked<LocalMessageDBService>;
    mockSummaryService = new SummaryService({} as any) as jest.Mocked<SummaryService>;
    mockSummaryStack = new SummaryStack({} as any) as jest.Mocked<SummaryStack>;
    mockSlidingWindow = new ConversationSlidingWindow({} as any) as jest.Mocked<ConversationSlidingWindow>;

    // ✅ Mock queue.toArray to avoid undefined errors
    mockSlidingWindow.queue = {
      toArray: jest.fn(),
    } as any;

    (ConversationSlidingWindow as jest.Mock).mockImplementation(() => mockSlidingWindow);
    (SummaryStack as jest.Mock).mockImplementation(() => mockSummaryStack);

    chatService = new ChatService({
      chatId: "chat-1",
      username: "user",
      assistantName: "assistant",
      slidingWindowSize: 3,
      summaryService: mockSummaryService,
      summaryStackDBService: {} as any,
      slidingWindowDBService: mockLocalMessageDBService,
      localMessageDBService: mockLocalMessageDBService,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("insertNewMessage", () => {
    it("should save message via LocalMessageDBService and enqueue to sliding window", async () => {
      const rawMessage = new RawMessageData({
        chatId: "chat-1",
        content: "Hello",
        sender: 'user'
      });
      const savedMessage = { ...rawMessage, id: "msg1" } as any;
      mockLocalMessageDBService.createMessage.mockResolvedValue(savedMessage);

      await chatService.insertNewMessage(rawMessage);

      expect(mockLocalMessageDBService.createMessage).toHaveBeenCalledWith(rawMessage);
      expect(toMessageData).toHaveBeenCalledWith(savedMessage);
      expect(mockSlidingWindow.enqueueMessage).toHaveBeenCalledWith(
        expect.objectContaining({ id: "msg1", content: "Hello" })
      );
    });
  });

  describe("summarizeNConversationSlidingWindow", () => {
    it("should summarize and push leaf if sliding window is full", async () => {
      mockSlidingWindow.isFull.mockReturnValue(true);
      (mockSlidingWindow.queue.toArray as jest.Mock).mockReturnValue([
        new MessageData({ id: "msg1", chatId: "chat-1", content: "Hello", sender: 'user' })
      ]);
      mockSlidingWindow.getMessageIdList.mockReturnValue(["msg1"]);
      mockSummaryService.summarizeConversation.mockResolvedValue("summary");

      await chatService.summarizeNConversationSlidingWindow();

      expect(mockSummaryService.summarizeConversation).toHaveBeenCalled();
      expect(mockSummaryStack.pushLeaf).toHaveBeenCalledWith("summary", ["msg1"]);
      expect(mockSlidingWindow.resetCount).toHaveBeenCalled();
    });

    it("should do nothing if sliding window is not full", async () => {
      mockSlidingWindow.isFull.mockReturnValue(false);

      await chatService.summarizeNConversationSlidingWindow();

      expect(mockSummaryService.summarizeConversation).not.toHaveBeenCalled();
      expect(mockSummaryStack.pushLeaf).not.toHaveBeenCalled();
      expect(mockSlidingWindow.resetCount).not.toHaveBeenCalled();
    });
  });

  describe("initializeChat", () => {
    it("should load last messages and initialize sliding window and summary stack", async () => {
      const lastMessages = [
        new MessageData({ id: "msg1", chatId: "chat-1", content: "Hello", sender: 'user' }),
        new MessageData({ id: "msg2", chatId: "chat-1", content: "Hi", sender: 'system' })
      ];
      mockLocalMessageDBService.getMessages.mockResolvedValue(lastMessages as any);

      await chatService.initializeChat();

      expect(mockLocalMessageDBService.getMessages).toHaveBeenCalledWith("chat-1", 3);
      expect(mockSlidingWindow.initialize).toHaveBeenCalledWith(lastMessages);
      expect(mockSummaryStack.initialize).toHaveBeenCalled();
    });
  });
});