// app/confirm-memory.tsx
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppColors from "@/core/styling/AppColors";
import { HighLevelChatSummary } from "@/services/SummaryService";
import { SafeAreaView } from "react-native-safe-area-context";
import GenericModal from "@/components/modals/genericModal";
import { Column, Padding } from "@/components/layout/layout";

export default function ConfirmMemoryScreen() {
  const router = useRouter();

  const {chatSummary} = useLocalSearchParams<{chatSummary: string}>();

  const parsed: HighLevelChatSummary = JSON.parse(chatSummary);

  const [tag, setTag] = useState<string>(parsed.tag.join(", ").replace("_", " "));
  const [summary, setSummary] = useState<string>(parsed.narrative);
  const [isLoading, setIsLoading] = useState(false);
  const handleCancel = () => {
    router.back();
  };

  const handleSave = () => {
    try{
      setIsLoading(true);
    }catch(err){
      console.error(`Failed to save narrative`)
    }finally{
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaView edges={["left", 'right', 'bottom']} style={styles.container}>
      <KeyboardAvoidingView
        style  = {{flex: 1,}}
        keyboardVerticalOffset={80}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle = {styles.scrollViewContentContainer}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
        >
          <Text style={styles.label}>Tag</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter tag"
            value={tag}
            onChangeText={setTag}
            placeholderTextColor={AppColors.secondaryColor}
          />

          <Text style={styles.label}>Narrative</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Enter summary"
            value={summary}
            onChangeText={setSummary}
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
      <GenericModal visible = {isLoading} onClose={() => {}}>
        <Column>
          <Padding style = {styles.modalContainer}>
            <Text style = {styles.modalTitleText}>Generating narrative...</Text>
            <ActivityIndicator size={'large'} color={AppColors.primaryColor}/>
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