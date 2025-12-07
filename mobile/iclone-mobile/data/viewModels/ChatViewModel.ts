import { useEffect, useState, useCallback, useRef } from "react";
import ChatService from "@/services/ChatService";
import DeepSeekClient from "@/domain/llm/deepSeek/model";
import SummaryService from "@/services/SummaryService";
import LocalMessageDBService from "@/services/localDB/LocalMessageDBService";
import database from "@/data/database/index.native";
import { eventBus } from "@/core/utils/eventBus";
import ServiceError from "@/core/errors/ServiceError";
import { LocalDBError } from "@/core/errors/LocalDBError";
import { LLMError } from "@/core/errors/LLMError";
import { FlatList } from "react-native";
import SummaryStackDBService from "@/services/localDB/SummaryStackDatabaseService";
import ChatDBService from "@/services/localDB/ChatDBService";
import { useAuth } from "@/core/contexts/authContext";

export const useChatViewModel = (chatId?: string, userMessage?: string, username?: string) => {
  const [chatService, setChatService] = useState<ChatService | null>(null);
  const [messageList, setMessageList] = useState<any[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  // refs
  const flatListRef = useRef<FlatList>(null);

  const auth = useAuth();

  /** Initialize chat service */
  useEffect(() => {
    const initializeChatService = async () => {
      try {
        if (!chatId) throw new ServiceError("Invalid chat ID");
        const apiKey = process.env.EXPO_PUBLIC_DEEP_SEEK_API_KEY;
        if (!apiKey) throw new ServiceError("Problem connecting to DeepSeek");

        if(! auth.user?.uid){
          throw new ServiceError("User info not found");
        }
        const model = new DeepSeekClient(apiKey);
        const summaryService = new SummaryService(model);
        const summaryStackDBService = new SummaryStackDBService(database);
        const localMessageDBService = new LocalMessageDBService(database);
        
        const chatDBService = new ChatDBService({database: database, userId: auth.user.uid})

        const service = new ChatService({
          chatId,
          username: username ?? "Guest",
          assistantName: "Eterne",
          slidingWindowSize: 3,
          summaryService,
          summaryStackDBService,
          localMessageDBService,
          llmModel: model,
          chatDBService: chatDBService
        });

        await service.initializeChat();
        setChatService(service);
      } catch (err: any) {
        console.error("ChatService init failed:", err);
        if (err instanceof ServiceError || err instanceof LocalDBError) {
          setError(err.message);
          setIsError(true);
        } else {
          setError("Unexpected error occurred");
          setIsError(true);
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initializeChatService();

    const onServiceError = () => setIsError(true);
    eventBus.on("service_error", onServiceError);

    return () => eventBus.off("service_error", onServiceError);
  }, [chatId]);

  /** Load messages & handle initial user message once chatService is ready */
  useEffect(() => {
    if (!chatService) return;

    const loadMessagesAndInit = async () => {
      try {
        const chatMessages = await chatService.getMessages();
        setMessageList(
          chatMessages.map((m) => ({
            content: m.content,
            sentByUser: m.sender === "user",
            isLastByUser: false,
          }))
        );

        // If no existing messages and there is an initial user message, send it
        if (!chatMessages.length && userMessage) {
          await pushUserMessage(userMessage);
          await generateResponse();
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
        setError("Failed to load messages");
      }
    };

    loadMessagesAndInit();
  }, [chatService]);

  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [messageList]);

  /** Push user message */
  const pushUserMessage = useCallback(
    async (content: string) => {
      if (!chatService) throw new Error("ChatService not initialized");
      await chatService.insertNewMessage(content, "user");
      setMessageList((prev) => [{ content, sentByUser: true, isLastByUser: false }, ...prev, ]);
    },
    [chatService]
  );

  /** Push system message */
  const pushSystemMessage = useCallback(
    async (content: string) => {
      if (!chatService) throw new Error("ChatService not initialized");
      await chatService.insertNewMessage(content, "system");
      setMessageList((prev) => [{ content, sentByUser: false, isLastByUser: false }, ...prev]);
    },
    [chatService]
  );

  /** Generate LLM response */
  const generateResponse = useCallback(async () => {
    if (!chatService) return;
    setIsAssistantTyping(true);
    try {
      const response = await chatService.chat();
      await pushSystemMessage(response);
    } catch (err: any) {
      console.error("LLM Error:", err);
      if (err instanceof LocalDBError || err instanceof LLMError || err instanceof ServiceError) {
        setError(err.message);
      } else {
        setError("Failed to get response");
      }
    } finally {
      setIsAssistantTyping(false);
    }
  }, [chatService, pushSystemMessage]);

  /** Close error modal */
  const handleErrorModalCloseButtonPress = () => {
    setError(null);
    setIsError(false);
  }

  return {
    isInitializing,
    error,
    isAssistantTyping,
    isUserTyping,
    messageList,
    isError,
    flatListRef,
    setIsUserTyping,
    pushUserMessage,
    generateResponse,
    handleErrorModalCloseButtonPress,
  };
};
