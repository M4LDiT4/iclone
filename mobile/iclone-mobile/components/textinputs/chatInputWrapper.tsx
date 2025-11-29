import { memo, useEffect, useRef, useState } from "react";
import { Keyboard, View, StyleSheet, Platform } from "react-native";
import ChatTextinput from "./chatTextinput";

interface ChatInputWrapperProps {
  handleSend: (content: string) => void | Promise<void>;
  triggerLLMResponse: () => void;
  setIsUserTyping: (val: boolean) => void;
  isUserTyping: boolean;
}

function ChatInputWrapper({
  handleSend,
  triggerLLMResponse,
  setIsUserTyping,
  isUserTyping,
}: ChatInputWrapperProps) {
  const [message, setMessage] = useState<string>("");

  const lastSentMessageRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  // Keyboard listeners
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () => {
      setIsUserTyping(true);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setIsUserTyping(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);


  const handleMessageChange = (newMessage: string) => {
    setMessage(newMessage);
    setIsUserTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleSendButtonPress = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    await handleSend(trimmed);
    lastSentMessageRef.current = trimmed;
    setMessage("");

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      if (lastSentMessageRef.current) {
        triggerLLMResponse();
        lastSentMessageRef.current = null;
      }
    }, 1000);
  };

  return (
    <View style={{ ...styles.textinputContainer, paddingBottom: isUserTyping ? 36 : 0 }}>
      <ChatTextinput
        value={message}
        onChangeText={handleMessageChange}
        onSend={handleSendButtonPress}
        componentStatus="idle"
      />
    </View>
  );
}

export default memo(ChatInputWrapper);



const styles = StyleSheet.create({
  textinputContainer: {
    paddingTop: 8,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
})