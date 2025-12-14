import PrimaryButton from "@/components/buttons/primaryButton";
import AssistantLogo from "@/components/chat/assistantLogo";
import ChatBubble from "@/components/chat/ChatBubble";
import { Column, Padding, Spacer, Stack } from "@/components/layout/layout";
import GenericModal from "@/components/modals/genericModal";
import LoadingScreen from "@/components/notifiers/loadingScreen";
import ChatInputWrapper from "@/components/textinputs/chatInputWrapper";
import { useAuth } from "@/core/contexts/authContext";
import { useChatContext } from "@/core/contexts/chatContext";
import database from "@/data/database/index.native";
import { useChatViewModel } from "@/data/viewModels/ChatViewModel";
import DeepSeekClient from "@/domain/llm/deepSeek/model";
import ChatService from "@/services/ChatService";
import ChatRepository from "@/services/localDB/ChatRepository";
import LocalMessageDBService from "@/services/localDB/LocalMessageDBService";
import SummaryStackDBService from "@/services/localDB/SummaryStackDatabaseService";
import SummaryService from "@/services/SummaryService";
import {useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { chatService, setChatService } = useChatContext();

  const { chatId, userMessage, username } = useLocalSearchParams();
  const auth = useAuth();

  // ──────────────────────────────────────────────
  // 1. Create ChatService when navigating to screen
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (!chatId || !auth!.user?.uid) return;

    const apiKey = process.env.EXPO_PUBLIC_DEEP_SEEK_API_KEY!;
    const model = new DeepSeekClient(apiKey);

    const newService = new ChatService({
      chatId: (chatId as string),
      username: (username as string)  ?? "Guest",
      assistantName: "Eterne",
      slidingWindowSize: 3,
      summaryService: new SummaryService(model),
      summaryStackDBService: new SummaryStackDBService(database),
      localMessageDBService: new LocalMessageDBService(database),
      llmModel: model,
      chatDBService: new ChatRepository({
        database,
        userId: auth!.user.uid
      }),
    });

    setChatService(newService);

    return () => {
      // Destroy service when leaving screen
      // Each chat service is tied to certain chat via chatId
      setChatService(null);
    };
  }, [chatId]);

  // ──────────────────────────────────────────────
  // 2. ViewModel logic (pure)
  // ──────────────────────────────────────────────
  const vm = useChatViewModel(chatService, (userMessage as string));

  if (vm.componentStatus === "initializing") return <LoadingScreen />;

  // ──────────────────────────────────────────────
  // 3. UI Rendering
  // ──────────────────────────────────────────────
  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <Padding style={{ flex: 1, paddingHorizontal: 16 }}>
          <Stack style={{ flex: 1 }}>
            <FlatList
              ref={vm.flatListRef}
              inverted
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingTop: vm.isUserTyping ? 50 : 0,
              }}
              data={vm.messageList}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => <ChatBubble {...item} />}
              keyboardShouldPersistTaps="handled"
            />

            {/* typing bubble */}
            <AssistantLogo
              type={
                vm.messageList.length > 2 || vm.isUserTyping
                  ? "small"
                  : "large"
              }
              isUserTyping={vm.isUserTyping}
              isSystemTyping={vm.isAssistantTyping}
            />
          </Stack>

          {/* chat input */}
          <ChatInputWrapper
            chatId={chatId as string}
            handleSend={vm.pushUserMessage}
            triggerLLMResponse={vm.generateResponse}
            setIsUserTyping={vm.setIsUserTyping}
            isUserTyping={vm.isUserTyping}
            generateNarrative={vm.generateNarrative}
          />
        </Padding>

        {/* Error modal */}
        <GenericModal visible={vm.modalState === "error"} onClose={() => {}}>
          <Column>
            <Padding style={styles.modalContainer}>
              <Text style={styles.modalText}>
                {vm.error ?? "Something went wrong"}
              </Text>
              <Spacer height={8} />
              <PrimaryButton
                label="Okay"
                onPress={vm.closeErrorModal}
              />
            </Padding>
          </Column>
        </GenericModal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
     flex: 1,
  },
  scroll: { flex: 1 },
  modalContainer : {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  modalText : {
    fontSize: 20,              // Larger than body text
    fontWeight: '700',         // Bold for emphasis
    color: '#023E65',          // Primary or brand color
    textAlign: 'center',       // Centered in the modal
    marginBottom: 12,          // Space below before content
    fontFamily: 'SFProText',   // Keep consistent with your app typography
  },
});

