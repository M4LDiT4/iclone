// ChatScreen.tsx
import {ScrollView, StyleSheet, View, Text} from "react-native";
import { useLocalSearchParams } from "expo-router";
import ChatBubble from "@/components/chat/ChatBubble";
import TypingIndicator from "@/components/texts/typingIndicator";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChatViewModel } from "@/data/viewModels/ChatViewModel";
import ChatInputWrapper from "@/components/textinputs/chatInputWrapper";
import LoadingScreen from "@/components/notifiers/loadingScreen";
import { Column, Padding, Spacer } from "@/components/layout/layout";
import GenericModal from "@/components/modals/genericModal";
import PrimaryButton from "@/components/buttons/primaryButton";

export default function ChatScreen() {
  const { chatId, userMessage } = useLocalSearchParams();
  const {
    messageList,
    isInitializing,
    error,
    isError,
    isAssistantTyping,
    isUserTyping,
    setIsUserTyping,
    pushUserMessage,
    generateResponse,
    handleErrorModalCloseButtonPress,
  } = useChatViewModel(chatId as string|undefined, userMessage as string|undefined);
 
  if (isInitializing) return <LoadingScreen/>;

  return (
    <SafeAreaView style={styles.container}>
      <Padding horizontal={16}>
        <ScrollView style={styles.scroll}>
          {messageList.map((msg, idx) => (
            <ChatBubble key={idx} {...msg} />
          ))}
          {isAssistantTyping && <TypingIndicator />}
        </ScrollView>
        <ChatInputWrapper
          handleSend={pushUserMessage}
          triggerLLMResponse={generateResponse}
          setIsUserTyping={setIsUserTyping}
          isUserTyping={isUserTyping}
        />
      </Padding>
      <GenericModal visible = {isError} onClose={() => {}}>
        <Column>
          <Padding style = {styles.signUpModalContainer}>
            <Text style = {styles.signUpModalTitleText}>{error ?? "Something went wrong"}</Text>
            <Spacer height={8}/>
            <PrimaryButton label="Okay" onPress={handleErrorModalCloseButtonPress}/>
          </Padding>
        </Column>
      </GenericModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  signUpModalContainer : {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  signUpModalTitleText : {
    fontSize: 20,              // Larger than body text
    fontWeight: '700',         // Bold for emphasis
    color: '#023E65',          // Primary or brand color
    textAlign: 'center',       // Centered in the modal
    marginBottom: 12,          // Space below before content
    fontFamily: 'SFProText',   // Keep consistent with your app typography
  },
});

