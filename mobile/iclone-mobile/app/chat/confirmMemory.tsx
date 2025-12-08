// app/confirm-memory.tsx
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AppColors from "@/core/styling/AppColors";

export default function ConfirmMemoryScreen() {
  const router = useRouter();
  const [tag, setTag] = useState<string>("");
  const [summary, setSummary] = useState<string>("");

  const handleCancel = () => {
    router.back();
  };

  const handleSave = () => {
    console.log("Saved:", { tag, summary });
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Memory</Text>

      <Text style={styles.label}>Tag</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter tag"
        value={tag}
        onChangeText={setTag}
        placeholderTextColor={AppColors.secondaryColor}
      />

      <Text style={styles.label}>Summary</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: AppColors.backgroundColor,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: AppColors.primaryColor,
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
});