import ConversationSlidingWindow from '@/domain/algorithms/ConversationSlidingWindow';
import MessageData from '@/data/application/MessageData';

describe('ConversationSlidingWindow', () => {
  const username = 'Jonathan';
  const assistantName = 'Eterne';

  const mockMessages: MessageData[] = [
    { sender: 'user', content: 'Hello', id: '1', chatId: 'chat-1' },
    { sender: 'system', content: 'Hi there!', id: '2', chatId: 'chat-1' },
    { sender: 'user', content: 'How are you?', id: '3', chatId: 'chat-1' },
    { sender: 'system', content: 'I’m good, thanks!', id: '4', chatId: 'chat-1' },
  ];

  let window: ConversationSlidingWindow;

  beforeEach(() => {
    window = new ConversationSlidingWindow({
      chatId: 'chat-1',
      queueMaxSize: 2,
      username,
      asssistantName: assistantName,
    });
  });

  test('initializes with messages and counts conversations', () => {
    window.initialize(mockMessages);
    expect(window.conversationCount).toBe(2);
    expect(window.isFull()).toBe(true);
  });

  test('enqueueMessage updates queue and conversation count', () => {
    window.enqueueMessage({ sender: 'user', content: 'Hey', id: '5', chatId: 'chat-1' });
    expect(window.conversationCount).toBe(0);
    expect(window.isUser).toBe(true);

    window.enqueueMessage({ sender: 'system', content: 'Hello!', id: '6', chatId: 'chat-1' });
    expect(window.conversationCount).toBe(1);
    expect(window.isUser).toBe(false);

    window.enqueueMessage({ sender: 'user', content: 'Another user', id: '7', chatId: 'chat-1' });
    expect(window.isUser).toBe(true);
    expect(window.conversationCount).toBe(1);

    window.enqueueMessage({ sender: 'system', content: 'Second reply', id: '8', chatId: 'chat-1' });
    expect(window.conversationCount).toBe(2);
    expect(window.isFull()).toBe(true);
  });

  test('dequeue removes messages from queue', () => {
    window.initialize(mockMessages);
    const initialSize = window.queue.size();
    window.dequeue();
    expect(window.queue.size()).toBe(initialSize - 1);
  });

  test('clear empties the queue', () => {
    window.initialize(mockMessages);
    window.clear();
    expect(window.queue.isEmpty()).toBe(true);
  });

  test('contentsToString formats messages with correct names and excludes last message', () => {
    window.initialize(mockMessages);
    const result = window.contentsToString();
    expect(result).toContain(`[${username}] : Hello`);
    expect(result).toContain(`[${assistantName}] : Hi there!`);
    expect(result).not.toContain(mockMessages[mockMessages.length - 1].content);
  });

  test('getMessageIdList returns correct IDs', () => {
    window.initialize(mockMessages);
    const ids = window.getMessageIdList();
    expect(ids).toEqual(['1', '2', '3', '4']);
  });

  test('resetCount sets conversationCount to zero', () => {
    window.initialize(mockMessages);
    expect(window.conversationCount).toBe(2);
    window.resetCount();
    expect(window.conversationCount).toBe(0);
  });

  test('isFull returns false when conversationCount < queueMaxSize', () => {
    window = new ConversationSlidingWindow({
      chatId: 'chat-1',
      queueMaxSize: 3,
      username,
      asssistantName: assistantName,
    });

    window.enqueueMessage({ sender: 'user', content: 'Start', id: '9', chatId: 'chat-1' });
    window.enqueueMessage({ sender: 'system', content: 'Reply', id: '10', chatId: 'chat-1' });
    expect(window.isFull()).toBe(false);
  });
});