import ConversationSlidingWindow from '@/domain/algorithms/ConversationSlidingWindow';
import MessageData from '@/data/application/MessageData';

describe('ConversationSlidingWindow', () => {
  const mockMessages: MessageData[] = [
    { sender: 'user', content: 'Hello', id: '1', chatId: 'chat-1'  },
    { sender: 'system', content: 'Hi there!', id: '2', chatId: 'chat-1'  },
    { sender: 'user', content: 'How are you?', id: '3', chatId: 'chat-1'  },
    { sender: 'system', content: 'I’m good, thanks!', id: '4', chatId: 'chat-1'  },
  ];

  let window: ConversationSlidingWindow;

  beforeEach(() => {
    window = new ConversationSlidingWindow({ chatId: 'chat-1', queueMaxSize: 2 });
  });

  test('initializes with messages and counts conversations', () => {
    window.initialize(mockMessages);
    expect(window.conversationCount).toBe(2);
    expect(window.isFull()).toBe(true);
  });

  test('enqueueMessage updates queue and conversation count', () => {
    window.enqueueMessage({ sender: 'user', content: 'Hey', id: '1', chatId: 'chat-1' });
    expect(window.conversationCount).toBe(0);
    window.enqueueMessage({ sender: 'system', content: 'Hello!', id: '1', chatId: 'chat-1'  });
    expect(window.conversationCount).toBe(1);
    window.enqueueMessage({sender: 'user', content: 'Reset to user', id: '1', chatId: 'chat-1'})
    expect(window.isUser);
    expect(window.conversationCount).toBe(1);
    window.enqueueMessage({sender: 'user', content: 'Another user', id: '1', chatId: 'chat-1'});
    expect(window.isUser);
    expect(window.conversationCount).toBe(1);
    window.enqueueMessage({ sender: 'system', content: 'size should be 2', id: '1', chatId: 'chat-1'  });
    expect(!window.isUser);
    expect(window.conversationCount).toBe(2);
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

  test('contentsToString excludes last message and formats correctly', () => {
    window.initialize(mockMessages);
    const result = window.contentsToString();
    expect(result).toContain('[message]: Hello');
    expect(result).toContain('[sender]: user');
    expect(result).not.toContain(mockMessages[mockMessages.length - 1].content);
  });

  test('isFull returns false when conversationCount < queueMaxSize', () => {
    window.enqueueMessage({ sender: 'user', content: 'Start', id: '1', chatId: '1'  });
    window.enqueueMessage({ sender: 'system', content: 'Reply', id: '1', chatId: '1'  });
    expect(window.isFull()).toBe(false);
  });
});