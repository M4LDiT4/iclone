import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GlobalStyles from "@/core/styling/GlobalStyles";
import { memo } from "react";
import AppColors from "@/core/styling/AppColors";
import LogoWithFloatingText from "@/components/logo/logoWithFloatingText";
import { Spacer } from "@/components/layout/layout";
import PrimaryButton from "@/components/buttons/primaryButton";

function OnboardingFinishScreen(){
  return <SafeAreaView style = {styles.safeAreaView}>
    <LinearGradient
      colors={["#6C9BCF", "#F8F9FA"]}
      style={GlobalStyles.screenGradientTop}
    />
    <LogoWithFloatingText width={249} text="That’s fine. I respect your privacy." />
    <Spacer height={75}/>
    <PrimaryButton label="Finish onboarding"/>
    <LinearGradient
      colors={["#F8F9FA", "#6C9BCF"]}
      style={GlobalStyles.screenGradientBottom}
    />
  </SafeAreaView>
}

export default memo(OnboardingFinishScreen)

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: AppColors.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  }
})