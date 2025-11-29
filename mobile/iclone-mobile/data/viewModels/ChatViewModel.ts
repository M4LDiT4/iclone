// ChatViewModel.ts
import { useEffect, useState, useCallback } from "react";
import ChatService from "@/services/ChatService";
import DeepSeekClient from "@/domain/llm/deepSeek/model";
import SummaryService from "@/services/SummaryService";
import SummaryStackDBService from "@/services/localDB/SummaryStackDBService";
import LocalMessageDBService from "@/services/localDB/LocalMessageDBService";
import database from "@/data/database/index.native";
import { eventBus } from "@/core/utils/eventBus";
import ServiceError from "@/core/errors/ServiceError";
import { LocalDBError } from "@/core/errors/LocalDBError";
import { LLMError } from "@/core/errors/LLMError";

export const useChatViewModel = (chatId: string | undefined, userMessage?: string, username?: string) => {
  const [chatService, setChatService] = useState<ChatService | null>(null);
  const [messageList, setMessageList] = useState<any[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  /** Initialize chat service */
  useEffect(() => {
    const initializeChatService = async () => {
      try {
        const apiKey = process.env.EXPO_PUBLIC_DEEP_SEEK_API_KEY;
        if (!apiKey) return setError("Problem connecting to DeepSeek");
        if (!chatId) return setError("Invalid chat ID");

        const model = new DeepSeekClient(apiKey);
        const summaryService = new SummaryService(model);
        const summaryStackDBService = new SummaryStackDBService(database);
        const localMessageDBService = new LocalMessageDBService(database);

        const service = new ChatService({
          chatId,
          username: username ?? "Guest",
          assistantName: "Eterne",
          slidingWindowSize: 10, // you can adjust the number of messages limit before summarizing
          summaryService,
          summaryStackDBService,
          localMessageDBService,
          llmModel: model,
        });

        await service.initializeChat();
        setChatService(service);
      } catch (err) {
        console.error("ChatService init failed:", err);
        if(err instanceof ServiceError || err instanceof LocalDBError){
          setError(err.message);
        }else{
          setError("Unexpected error occurred");
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initializeChatService();

    const onServiceError = () => setIsError(true);
    eventBus.on("service_error", onServiceError);

    return () => {
      eventBus.off("service_error", onServiceError);
    };
  }, [chatId]);

  /** Load messages & handle initial user message */
  useEffect(() => {
    if (!chatService) return;

    const loadMessages = async () => {
      const chatMessages = await chatService.getMessages();
      setMessageList(
        chatMessages.map((m) => ({
          content: m.content,
          sentByUser: m.sender === "user",
          isLastByUser: false,
        }))
      );
      // use the passed userMessage as the starting message
      // we can use templates to start conversation and we pass theirr value to this 
      // component using the userMessage key in the arguments section of the router.
      if (!chatMessages.length && userMessage) {
        await pushUserMessage(userMessage);
        await generateResponse();
      }
    };

    loadMessages();
  }, [chatService]);

  /** Push user message */
  const pushUserMessage = useCallback(
    async (content: string) => {
      if (!chatService) return;
      await chatService.insertNewMessage(content, "user");
      setMessageList((prev) => [...prev, { content, sentByUser: true, isLastByUser: false }]);
    },
    [chatService]
  );

  /** Push system message */
  const pushSystemMessage = useCallback(
    async (content: string) => {
      if (!chatService) return;
      await chatService.insertNewMessage(content, "system");
      setMessageList((prev) => [...prev, { content, sentByUser: false, isLastByUser: false }]);
    },
    [chatService]
  );

  /** Generate LLM response */
  const generateResponse = useCallback(async () => {
    if (!chatService) return;
    setIsAssistantTyping(true);
    try {
      const response = await chatService.chat();
      console.log(response);
      await pushSystemMessage(response);
    } catch (err) {
      console.error("LLM Error:", err);
      if(err instanceof LocalDBError || err instanceof LLMError || err instanceof ServiceError){
        setError(err.message);
      }else{
        setError("Failed to get get response");
      }
    } finally {
      setIsAssistantTyping(false);
    }
  }, [chatService, pushSystemMessage]);

  /** sets the error to null so that the modal will not show*/
  const handleErrorModalCloseButtonPress = () => {
    setError(null);
  }
  return {
    isInitializing,
    error,
    isAssistantTyping,
    isUserTyping,
    messageList,
    isError,
    setIsUserTyping,
    pushUserMessage,
    generateResponse,
    handleErrorModalCloseButtonPress,
  };
};
