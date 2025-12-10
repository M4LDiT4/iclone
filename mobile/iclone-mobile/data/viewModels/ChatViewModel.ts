import { useEffect, useState, useCallback, useRef } from "react";
import ChatService from "@/services/ChatService";
import { FlatList } from "react-native";

export const useChatViewModel = (
  chatService: ChatService | null,
  initialUserMessage?: string
) => {
  const [messageList, setMessageList] = useState<any[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  /** Load messages */
  useEffect(() => {
    if (!chatService) return;

    const load = async () => {
      try {
        await chatService.initializeChat();

        const msgs = await chatService.getMessages();
        setMessageList(
          msgs.map(m => ({
            content: m.content,
            sentByUser: m.sender === "user",
            isLastByUser: false,
          }))
        );

        if (!msgs.length && initialUserMessage) {
          await pushUserMessage(initialUserMessage);
          await generateResponse();
        }
      } catch (err: any) {
        setError("Failed to load messages");
        setIsError(true);
      } finally {
        setIsInitializing(false);
      }
    };

    load();
  }, [chatService]);

  /** User message */
  const pushUserMessage = useCallback(
    async (content: string) => {
      if (!chatService) return;
      await chatService.insertNewMessage(content, "user");
      setMessageList(prev => [
        { content, sentByUser: true, isLastByUser: false },
        ...prev,
      ]);
    },
    [chatService]
  );

  /** System/assistant message */
  const pushSystemMessage = useCallback(
    async (content: string) => {
      if (!chatService) return;
      await chatService.insertNewMessage(content, "system");
      setMessageList(prev => [
        { content, sentByUser: false, isLastByUser: false },
        ...prev,
      ]);
    },
    [chatService]
  );

  /** LLM response */
  const generateResponse = useCallback(async () => {
    if (!chatService) return;

    setIsAssistantTyping(true);

    try {
      const response = await chatService.chat();
      await pushSystemMessage(response);
    } catch (err: any) {
      setError("Failed to get response");
      setIsError(true);
    } finally {
      setIsAssistantTyping(false);
    }
  }, [chatService, pushSystemMessage]);

  /** Summary */
  const saveNarrative = useCallback(async () => {
    if (!chatService) throw new Error("ChatService is not initialized");
    return await chatService.generateSummary();
  }, [chatService]);

  /** Close the error modal */
  const closeErrorModal = useCallback(() => {
    setError(null);
  }, []);

  return {
    messageList,
    isInitializing,
    isAssistantTyping,
    isUserTyping,
    setIsUserTyping,
    pushUserMessage,
    generateResponse,
    saveNarrative,
    closeErrorModal,
    error,
    isError,
    flatListRef,
  };
};

