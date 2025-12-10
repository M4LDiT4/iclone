import { memo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity, View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GlobalStyles from "@/core/styling/GlobalStyles";
import AppColors from "@/core/styling/AppColors";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import GenericContainer from "@/components/containers/genericContainer";
import MemoryContainer from "@/components/memoryList/memoryContainer";

function MemoryListScreen () {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  }
  return <SafeAreaView style = {styles.safeAreaView}>
    <LinearGradient
      colors={['#6C9BCF', "#F8F9FA"]}
      style={GlobalStyles.screenGradientTop}
    />
    <View style = {styles.header}>
      <TouchableOpacity onPress={handleGoBack}>
        <Feather name="arrow-left-circle" size={36} color={AppColors.secondaryColor} />
      </TouchableOpacity>
      <Text style={styles.labelText}>{"Memory"}</Text>
      <MaterialIcons name="more-vert" size={28} color={AppColors.secondaryColor} />
    </View>
    <ScrollView
      contentContainerStyle = {styles.scrollViewContentContainer}
    >
      <MemoryContainer>
        <Text>Hello</Text>
      </MemoryContainer>
    </ScrollView>
    <LinearGradient
      colors={["#F8F9FA", "#6C9BCF"]}
      style={GlobalStyles.screenGradientBottom}
    />
  </SafeAreaView>
}

export default memo(MemoryListScreen);

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: AppColors.backgroundColor,
  },
  header: {
    height: 70,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  labelText: {
    fontFamily: "SFProText",
    fontWeight: "bold",
    fontSize: 31,
    lineHeight: 31,
    color: AppColors.primaryColor,
  },
  scrollViewContentContainer : {
   paddingHorizontal: 16,
  }
});
