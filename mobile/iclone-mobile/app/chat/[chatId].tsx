import PrimaryButton from "@/components/buttons/primaryButton";
import AssistantLogo from "@/components/chat/assistantLogo";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatHeader from "@/components/headers/chatHeader";
import { Column, Padding, Spacer,} from "@/components/layout/layout";
import GenericModal from "@/components/modals/genericModal";
import LoadingScreen from "@/components/notifiers/loadingScreen";
import ChatInputWrapper from "@/components/textinputs/chatInputWrapper";
import { useAuth } from "@/core/contexts/authContext";
import { useChatContext } from "@/core/contexts/chatContext";
import AppColors from "@/core/styling/AppColors";
import GlobalStyles from "@/core/styling/GlobalStyles";
import database from "@/data/database/index.native";
import { useChatViewModel } from "@/data/viewModels/ChatViewModel";
import DeepSeekClient from "@/domain/llm/deepSeek/model";
import ChatService from "@/services/ChatService";
import ChatRepository from "@/services/localDB/ChatRepository";
import LocalMessageDBService from "@/services/localDB/LocalMessageDBService";
import SummaryStackDBService from "@/services/localDB/SummaryStackDatabaseService";
import SummaryService from "@/services/SummaryService";
import { LinearGradient } from "expo-linear-gradient";
import {useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { chatService, setChatService } = useChatContext();
  const { chatId, userMessage, username } = useLocalSearchParams();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!chatId || !auth!.user?.uid) return;

    const apiKey = process.env.EXPO_PUBLIC_DEEP_SEEK_API_KEY!;
    const model = new DeepSeekClient(apiKey);

    const newService = new ChatService({
      chatId: chatId as string,
      username: (username as string) ?? "Guest",
      assistantName: "Eterne",
      slidingWindowSize: 3,
      summaryService: new SummaryService(model),
      summaryStackDBService: new SummaryStackDBService(database),
      localMessageDBService: new LocalMessageDBService(database),
      llmModel: model,
      chatDBService: new ChatRepository({
        database,
        userId: auth!.user.uid,
      }),
    });

    setChatService(newService);
    return () => setChatService(null);
  }, [chatId]);

  const vm = useChatViewModel(chatService, userMessage as string);
  if (vm.componentStatus === "initializing") return <LoadingScreen />;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#6C9BCF", "#F8F9FA"]}
        style={GlobalStyles.screenGradientTop}
      />
      <ChatHeader label="Converse" onBackPress={() => router.back()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : 'height'}
      >
        {/* MESSAGES */}
        <View style = {{flex: 1,}}>
          <FlatList
          ref={vm.flatListRef}
          inverted
          data={vm.messageList}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <ChatBubble {...item} />}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />

        {/* TYPING INDICATOR */}
        <AssistantLogo
          type={
            "small"
          }
          isUserTyping={vm.isUserTyping}
          isSystemTyping={vm.isAssistantTyping}
        />
        </View>
        {/* INPUT (ANCHOR) */}
        <ChatInputWrapper
          chatId={chatId as string}
          handleSend={vm.pushUserMessage}
          triggerLLMResponse={vm.generateResponse}
          setIsUserTyping={vm.setIsUserTyping}
          isUserTyping={vm.isUserTyping}
          generateNarrative={vm.generateNarrative}
          isAssistantTyping={vm.isAssistantTyping}
        />

        {/* ERROR MODAL */}
        <GenericModal visible={vm.modalState === "error"} onClose={() => {}}>
          <Column>
            <Text style={styles.modalText}>
              {vm.error ?? "Something went wrong"}
            </Text>
            <Spacer height={8} />
            <PrimaryButton label="Okay" onPress={vm.closeErrorModal} />
          </Column>
        </GenericModal>
      </KeyboardAvoidingView>
      <LinearGradient
        colors={["#F8F9FA", "#6C9BCF"]}
        style={GlobalStyles.screenGradientBottom}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundColor,
    paddingHorizontal: 16,
    paddingBottom: 38,
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 96,
    paddingTop: 60 
  },
  modalText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#023E65",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "SFProText",
  },
});

