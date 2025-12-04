import { memo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import GlobalStyles from "@/core/styling/GlobalStyles";
import { LinearGradient } from "expo-linear-gradient";
import AppColors from "@/core/styling/AppColors";
import LogoWithFloatingText from "@/components/logo/logoWithFloatingText";
import { Spacer } from "@/components/layout/layout";

function HealthStatusScreen() {
  return <SafeAreaView style = {styles.safeAreaView}>
    <LinearGradient
      colors={["#6C9BCF", "#F8F9FA"]}
      style={GlobalStyles.screenGradientTop}
    />
    <LogoWithFloatingText 
      text={`For me to function better as your companion, I need to know about your health status. Are you diagnosed with a disease or health issue?`} 
      width={249}
      textContainerVerticalPosition={-75}
    />
    <Spacer height={75}/>
    
    <LinearGradient
      colors={["#F8F9FA", "#6C9BCF"]}
      style={GlobalStyles.screenGradientBottom}
    />
  </SafeAreaView>
}

export default memo(HealthStatusScreen);

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: AppColors.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  }
});