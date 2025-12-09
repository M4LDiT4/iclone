import { memo, useEffect, useRef, useState } from "react";
import { Keyboard, View, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChatTextinput from "./chatTextinput";
import { Ionicons } from "@expo/vector-icons";
import AppColors from "@/core/styling/AppColors";
import { Column, Padding, Spacer } from "../layout/layout";
import GenericModal from "../modals/genericModal";
import PrimaryButton from "../buttons/primaryButton";
import { Text } from "react-native";
import OutlineButton from "../buttons/outlinedButton";

interface ChatInputWrapperProps {
  handleSend: (content: string) => void | Promise<void>;
  triggerLLMResponse: () => void;
  setIsUserTyping: (val: boolean) => void;
  handleSaveNarrative: () => void;
  isUserTyping: boolean;
}

function ChatInputWrapper({
  handleSend,
  triggerLLMResponse,
  setIsUserTyping,
  isUserTyping,
  handleSaveNarrative,
}: ChatInputWrapperProps) {
  const insets = useSafeAreaInsets(); // 👈 get safe area values
  const [message, setMessage] = useState<string>("");
  const [showSave, setShowSave] = useState(false);

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

  const handleSaveMessage = () => {
    closeSaveModal();
  }

  const openSaveModal = () => setShowSave(true);
  const closeSaveModal = () => setShowSave(false);

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
    <View
      style={[
        styles.textinputContainer,
        {
          // 👇 dynamic bottom padding using safe area
          paddingBottom: insets.bottom + 8 + (isUserTyping? 30: 0),
        },
      ]}
    >
      <TouchableOpacity onPress={openSaveModal} style = {styles.saveButton}>
        <Ionicons size={30} name="save-outline" color={AppColors.backgroundColor}/>
      </TouchableOpacity>
      <Spacer width={8}/>
      <ChatTextinput
        value={message}
        onChangeText={handleMessageChange}
        onSend={handleSendButtonPress}
        componentStatus="idle"
      />
      <GenericModal visible = {showSave} onClose={() => {}}>
          <Column>
            <Padding style = {styles.modalContainer}>
              <Text style = {styles.modalTitleText}>Save Conversation as Memory?</Text>
              <Spacer height={8}/>
              <View style ={{width: '100%', flexDirection: 'row'}}>
                <OutlineButton onPress={closeSaveModal} style={{flex: 1}} label="No"/>
                <Spacer width={8}/>
                <PrimaryButton style={{flex: 1}} label="Yes" onPress={handleSaveMessage}/>
              </View>
            </Padding>
          </Column>
        </GenericModal>
    </View>

  );
}

export default memo(ChatInputWrapper);

const styles = StyleSheet.create({
  textinputContainer: {
    paddingTop: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  modalContainer : {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  modalTitleText : {
    fontSize: 20,              // Larger than body text
    fontWeight: '700',         // Bold for emphasis
    color: '#023E65',          // Primary or brand color
    textAlign: 'center',       // Centered in the modal
    marginBottom: 12,          // Space below before content
    fontFamily: 'SFProText',   // Keep consistent with your app typography
  },
  saveButton: { 
    height: 47, 
    padding: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: AppColors.primaryColor, 
    borderRadius: 8
  }
});
