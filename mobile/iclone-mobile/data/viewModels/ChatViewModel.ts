import { useEffect, useState, useCallback, useRef } from "react";
import ChatService from "@/services/ChatService";
import { FlatList } from "react-native";
import ComponentStatus from "@/core/types/componentStatusType";
import { ModalType } from "@/core/types/modalTypes";

export const useChatViewModel = (
  chatService: ChatService | null,
  initialUserMessage?: string
) => {
  const [messageList, setMessageList] = useState<any[]>([]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [componentStatus, setComponentStatus] = useState<ComponentStatus>("idle");
  const [modalState, setModalStatus] = useState<ModalType>("none");

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
        setModalStatus("error");
      } finally {
        setComponentStatus("idle");
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
      setModalStatus("error")
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
    // the modal is dependent on the error string
    // if we set the error string to null, the modal should disappear by design
    // update this if the modal is not updated and is no longer dependent on  the 
    // error string
    setError(null);
  }, []);

  return {
    messageList,
    isAssistantTyping,
    isUserTyping,
    setIsUserTyping,
    pushUserMessage,
    generateResponse,
    saveNarrative,
    closeErrorModal,
    error,
    flatListRef,
    componentStatus,
    modalState,
  };
};

