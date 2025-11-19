import ContentCard from "@/components/cards/contentCard";
import { Padding } from "@/components/layout/layout";
import AgenticLogo from "@/components/logo/agenticLogo";
import AppColors from "@/core/styling/AppColors";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MemoryScreen() {
  return (
    <SafeAreaView style = {styles.safeArea}>
      <ScrollView contentContainerStyle = {styles.scrollContent} style = {styles.scrollView}>
        <Padding horizontal={16}>
          <Padding bottom={24}>
            <AgenticLogo/>
          </Padding>
          <ContentCard/>
        </Padding>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.backgroundColor,
    paddingBottom: 16,
  },
  scrollView : {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  }
})