import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import GlobalStyles from "@/core/styling/GlobalStyles";
import AppColors from "@/core/styling/AppColors";
import LogoWithFloatingText from "@/components/logo/logoWithFloatingText";
import CrossPlatformDatePicker from "@/components/pickers/crossPlatformDatePicker";

function SetBirthDateScreen (){
  return <SafeAreaView style = {styles.safeArea}>
    <LinearGradient
      colors={["#6C9BCF", "#F8F9FA"]}
      style={GlobalStyles.screenGradientTop}
    />
    <LogoWithFloatingText text="Hi Elena! Nice meeting you! May I know your birth date?" width={252}/>
    <CrossPlatformDatePicker/>
    <LinearGradient
      colors={["#F8F9FA", "#6C9BCF"]}
      style={GlobalStyles.screenGradientBottom}
    />
  </SafeAreaView>
};

export default memo(SetBirthDateScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: AppColors.backgroundColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
})