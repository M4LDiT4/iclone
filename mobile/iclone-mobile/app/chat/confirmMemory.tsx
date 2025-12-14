import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppColors from "@/core/styling/AppColors";
import { HighLevelChatSummary } from "@/services/SummaryService";
import { SafeAreaView } from "react-native-safe-area-context";
import GenericModal from "@/components/modals/genericModal";
import { Column, Padding, Spacer } from "@/components/layout/layout";
import { useChatContext } from "@/core/contexts/chatContext";
import { ModalType } from "@/core/types/modalTypes";
import PrimaryButton from "@/components/buttons/primaryButton";
import IconRenderer from "@/components/icons/iconRenderer";

// services
import DeepSeekClient from "@/domain/llm/deepSeek/model";
import ChatService from "@/services/ChatService";
import ChatRepository from "@/services/localDB/ChatRepository";
import LocalMessageDBService from "@/services/localDB/LocalMessageDBService";
import SummaryStackDBService from "@/services/localDB/SummaryStackDatabaseService";
import SummaryService from "@/services/SummaryService";
import database from "@/data/database/index.native";
import { useAuth } from "@/core/contexts/authContext";

export default function ConfirmMemoryScreen() {
  const router = useRouter();
  const { chatService, setChatService } = useChatContext();
  const auth = useAuth();

  const { chatSummary, chatId} = useLocalSearchParams<{ chatSummary: string; chatId: string }>();
  const parsedSummary: HighLevelChatSummary = JSON.parse(chatSummary);

  const [tag, setTag] = useState<string>(parsedSummary.tag.join(", ").replace("_", " "));
  const [narrative, setNarrative] = useState<string>(parsedSummary.narrative);
  const [title, setTitle] = useState<string>(parsedSummary.title);
  const [modalState, setModalState] = useState<ModalType>("none");

  // ──────────────────────────────────────────────
  // Ensure ChatService exists and matches chatId
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (!chatId || !auth?.user?.uid) return;

    if (!chatService || chatService.chatId !== chatId) {
      const apiKey = process.env.EXPO_PUBLIC_DEEP_SEEK_API_KEY!;
      const model = new DeepSeekClient(apiKey);

      const newService = new ChatService({
        chatId: chatId as string,
        username: auth.user?.displayName ?? "Guest",
        assistantName: "Eterne",
        slidingWindowSize: 3,
        summaryService: new SummaryService(model),
        summaryStackDBService: new SummaryStackDBService(database),
        localMessageDBService: new LocalMessageDBService(database),
        llmModel: model,
        chatDBService: new ChatRepository({
          database,
          userId: auth.user.uid,
        }),
      });

      setChatService(newService);
    }
  }, [chatId, auth?.user?.uid]);

  const handleCancel = () => router.back();

  const handleSave = async () => {
    try {
      if (!chatService) {
        console.error("ChatService is not available on the confirm memory screen.");
        return;
      }
      setModalState("loading");
      const tags = tag.split(",").map((t) => t.trim());
      const updatedSummary: HighLevelChatSummary = {
        tag: tags,
        title,
        summary: parsedSummary.summary, // corrected to use summary
        narrative,
        icon: parsedSummary.icon,
      };
      await chatService.saveSummary(updatedSummary);
      setModalState("success");
    } catch (err) {
      console.error("Failed to save narrative", err);
      setModalState("error");
    }
  };

  const handleCloseSuccessModal = () => {
    setModalState("none");
    router.back();
  };

  const handleCloseErrorModal = () => setModalState("none");

  // ──────────────────────────────────────────────
  // UI Rendering
  // ──────────────────────────────────────────────
  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContentContainer}
          keyboardShouldPersistTaps="handled"
          scrollEnabled
        >
          <Text style={styles.label}>Tag</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter tag"
            value={tag}
            onChangeText={setTag}
            placeholderTextColor={AppColors.secondaryColor}
          />
          <Text style={styles.label}>Icon</Text>
          <IconRenderer library={parsedSummary.icon.library} name={parsedSummary.icon.name} />
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={AppColors.secondaryColor}
          />
          <Text style={styles.label}>Narrative</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Enter Narrative"
            value={narrative}
            onChangeText={setNarrative}
            multiline
            placeholderTextColor={AppColors.secondaryColor}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modals */}
      <GenericModal visible={modalState === "loading"} onClose={() => {}}>
        <Column>
          <Padding style={styles.modalContainer}>
            <Text style={styles.modalTitleText}>Saving narrative...</Text>
            <ActivityIndicator size="large" color={AppColors.primaryColor} />
          </Padding>
        </Column>
      </GenericModal>
      <GenericModal visible={modalState === "success"} onClose={() => {}}>
        <Column>
          <Padding style={styles.modalContainer}>
            <Text style={styles.modalTitleText}>Narrative saved successfully!</Text>
            <Spacer height={16} />
            <PrimaryButton
              style={{ flexDirection: "row", justifyContent: "center" }}
              onPress={handleCloseSuccessModal}
              label="Okay"
            />
          </Padding>
        </Column>
      </GenericModal>
      <GenericModal visible={modalState === "error"} onClose={() => {}}>
        <Column>
          <Padding style={styles.modalContainer}>
            <Text style={styles.modalTitleText}>Failed to save narrative</Text>
            <Spacer height={16} />
            <PrimaryButton onPress={handleCloseErrorModal} label="Cancel" />
          </Padding>
        </Column>
      </GenericModal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.backgroundColor,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    color: AppColors.primaryColor,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.secondaryColor,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    color: AppColors.primaryColor,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancel: {
    backgroundColor: AppColors.secondaryColor,
  },
  save: {
    backgroundColor: AppColors.primaryColor,
  },
  buttonText: {
    color: AppColors.backgroundColor,
    fontSize: 16,
    fontWeight: "500",
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 30,
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
});