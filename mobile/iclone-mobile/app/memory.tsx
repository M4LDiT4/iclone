import AppColors from "@/core/styling/AppColors";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MemoryScreen() {
  return (
    <SafeAreaView style = {styles.safeArea}>
      <ScrollView>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.backgroundColor,
    paddingBottom: 16
  }
})