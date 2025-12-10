import ChatService from "@/services/ChatService"
import { createContext, useContext, useState } from "react";

type ChatContext = {
  chatService: ChatService | null;
  setChatService: (chatService: ChatService | null) => void
}

const ChatContext = createContext<ChatContext | undefined>(undefined);

export const ChatProvider = ({children}:{children: React.ReactNode}) => {
  const [chatService, setChatService] = useState<ChatService | null>(null);

  return <ChatContext.Provider value={{
    chatService: chatService,
    setChatService: setChatService
  }}>
    {children}
  </ChatContext.Provider>
}

export const useChatContext = (): ChatContext => {
  const context = useContext(ChatContext);
  if(!context){
    throw new Error(`useChatContext must be used inside a ChatProvider`);
  }
  return context;
}