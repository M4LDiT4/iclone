import { memo, useEffect, useRef, useState } from "react";
import { Keyboard, View, StyleSheet, Platform, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChatTextinput from "./chatTextinput";
import { Ionicons } from "@expo/vector-icons";
import AppColors from "@/core/styling/AppColors";
import { Column, Padding, Spacer } from "../layout/layout";
import GenericModal from "../modals/genericModal";
import PrimaryButton from "../buttons/primaryButton";
import { Text } from "react-native";
import OutlineButton from "../buttons/outlinedButton";
import { HighLevelChatSummary } from "@/services/SummaryService";
import { router } from "expo-router";

interface ChatInputWrapperProps {
  handleSend: (content: string) => void | Promise<void>;
  triggerLLMResponse: () => void;
  setIsUserTyping: (val: boolean) => void;
  generateNarrative: () => Promise<HighLevelChatSummary>;
  isUserTyping: boolean;
  isAssistantTyping: boolean;
  chatId: string,
}

function ChatInputWrapper({
  handleSend,
  triggerLLMResponse,
  setIsUserTyping,
  isUserTyping,
  isAssistantTyping,
  generateNarrative,
  chatId,
}: ChatInputWrapperProps) {
  const insets = useSafeAreaInsets(); 
  const [message, setMessage] = useState<string>("");
  const [showSave, setShowSave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingResponse, setPendingResponse] = useState(false);

  const typingTimeoutRef = useRef<number | null>(null);

  // Keyboard listeners
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    // listen to keyboard show and hide events
    // necessary for the isUserTyping flag
    const showSub = Keyboard.addListener(showEvent, () => {
      setIsUserTyping(true);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setIsUserTyping(false);
    });

    return () => {
      // cleanup
      showSub.remove();
      hideSub.remove();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    };
  }, []);

  // batch the user messages when the assistant is typing
  // trigger a response only after the assistant finished typing
  useEffect(() => {
    if(!isAssistantTyping && pendingResponse){
      triggerLLMResponse();
      setPendingResponse(false);
    }
  }, [isAssistantTyping, pendingResponse, triggerLLMResponse]);

  const handleMessageChange = (newMessage: string) => {
    setMessage(newMessage);
    setIsUserTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleSaveMessage = async () => {
    closeSaveModal();
    try{
      setIsLoading(true);
      const narrative = await generateNarrative();
      router.push({
        pathname: '/chat/confirmMemory',
        params: {
          chatSummary: JSON.stringify(narrative),
          chatId: chatId
        }
      });
    }catch(err){
      // maybe throw an error
      console.error(`Failed to save message`)
    }finally{
      setIsLoading(false);
    }
  }

  const openSaveModal = () => setShowSave(true);
  const closeSaveModal = () => setShowSave(false);


  const handleSendButtonPress = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    await handleSend(trimmed);
    setMessage("");

    // Clear any existing debounce
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Debounce: wait 1s after last send before triggering response
    typingTimeoutRef.current = setTimeout(() => {
      if (!isAssistantTyping) {
        // Assistant idle → trigger immediately
        triggerLLMResponse();
      } else {
        // Assistant busy → mark response as pending
        setPendingResponse(true);
      }
    }, 1000);
  };


  return (
    <View
      style={styles.textinputContainer}
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
      <GenericModal visible = {isLoading} onClose={() => {}}>
        <Column>
          <Padding style = {styles.modalContainer}>
            <Text style = {styles.modalTitleText}>Generating narrative...</Text>
            <ActivityIndicator size={'large'} color={AppColors.primaryColor}/>
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
