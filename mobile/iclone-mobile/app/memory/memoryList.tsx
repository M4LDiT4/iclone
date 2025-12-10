import { memo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity, View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GlobalStyles from "@/core/styling/GlobalStyles";
import AppColors from "@/core/styling/AppColors";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import MemoryContainer from "@/components/memoryList/memoryContainer";
import Logo from "../../assets/svg/llm_logo.svg";
import { BlurView } from "expo-blur";
import GradientContainer from "@/components/containers/gradientContainer";

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
      <View style = {styles.logoContainer}>
        <Logo width={116} height={116}/>
        <BlurView style = {styles.logoTextContainer}>
          <GradientContainer opacity={0.8}>
            <View style = {styles.logoTextContentContainer}>
              <Text style = {styles.logoText}>These are what you shared to me so far</Text>
            </View>
          </GradientContainer>
        </BlurView>
      </View>
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
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    paddingBottom: 20,
    marginBottom: 20,
  },
  logoTextContainer: {
    position: 'absolute',
    bottom: -10,
    borderRadius: 10, overflow: 'hidden',
  },
  logoTextContentContainer: {
    padding: 8,
    borderRadius: 10,
  },
  logoText: {
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: "SFProText",
    color: AppColors.primaryColor,
    textAlign: "center",
  }
});
