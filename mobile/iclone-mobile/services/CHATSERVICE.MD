# Chat Summarization Service

This service provides a system for real-time chat summarization with long-term memory. It maintains a **sliding window of recent messages** and a **summary stack** for persistent, hierarchical summarization using an LLM.

---

## Features

- **Sliding Window**: Keeps the last N messages for immediate context.
- **Long-term Memory Stack**: Hierarchical summaries stored in a persistent stack.
- **LLM Summarization**: Uses DeepSeek (or similar) to merge summaries, summarize conversations, and generate context-aware memory.
- **Persistent Storage**: Stores messages, summaries, and stack items in **WatermelonDB**.
- **Automatic Merging**: Merges top stack nodes when sizes match to keep stack concise.
- **Conversation Context**: Captures roles, topics, decisions, motivations, and emotional tone.

---

## Modules

### 1. `ChatService`
- Orchestrates message handling.
- Inserts messages into sliding window and DB.
- Triggers summarization when sliding window is full.
- Pushes summaries to `SummaryStack`.

### 2. `ConversationSlidingWindow`
- Fixed-size queue of recent messages.
- Determines when summarization should occur.

### 3. `SummaryStack`
- Stack structure for summaries.
- Merges nodes of equal size recursively.
- Generates overall stack summary.

### 4. `SummaryService`
- Uses LLM to:
  - Summarize sliding window messages.
  - Merge two summaries (`summarizePair`).
  - Summarize entire conversations.

### 5. `LocalMessageDBService`
- CRUD operations for messages.

### 6. `SummaryStackDBService`
- CRUD operations for summary nodes and stack items.
- Converts DB models into `SummaryNode` objects recursively.

### 7. `DeepSeekClient`
- Wrapper for LLM API calls.

---

## Data Flow

1. **Message Arrival**
   - Inserted into DB and sliding window.
2. **Sliding Window Full**
   - Messages converted to prompt → `SummaryService.summarize`.
3. **Summary Stack**
   - Push new leaf node.
   - Merge top nodes if needed.
   - Update persistent stack summary.

---

## Usage Example

```ts
import ChatService from "@/services/ChatService";
import SummaryService from "@/services/SummaryService";
import SummaryStackDBService from "@/services/localDB/summaryStackDBService";
import LocalMessageDBService from "@/services/localDB/LocalMessageDBService";
import DeepSeekClient from "@/domain/llm/deepSeek/model";

// Initialize LLM
const llmClient = new DeepSeekClient("YOUR_API_KEY");
const summaryService = new SummaryService(llmClient);

// Initialize DB services
const localMessageDB = new LocalMessageDBService(database);
const summaryStackDB = new SummaryStackDBService(database);

// Initialize ChatService
const chatService = new ChatService({
  chatId: "chat123",
  slidingWindowSize: 10,
  summaryService,
  summaryStackDBService: summaryStackDB,
  slidingWindowDBService: localMessageDB,
  localMessageDBService: localMessageDB
});

// Load existing chat state
await chatService.initializeChat();

// Add new message
await chatService.insertNewMessage({
  chatId: "chat123",
  content: "Hello, how are you?",
  sender: "user"
});

// Summarize sliding window if full
await chatService.summarizeNConversationSlidingWindow();
