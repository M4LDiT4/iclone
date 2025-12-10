import { View, Text, StyleSheet} from "react-native"
import Logo from "../../assets/svg/llm_logo.svg"
import { BlurView } from "expo-blur"
import GradientContainer from "../containers/gradientContainer"
import AppColors from "@/core/styling/AppColors"
import { memo } from "react"

function EterneLogo(){
  return <View style = {styles.container}>
    <Logo width={116} height={116}/>
    <BlurView style = {styles.logoTextContainer}>
      <GradientContainer opacity={0.8}>
        <View style = {styles.logoTextContentContainer}>
          <Text style = {styles.logoText}>These are what you shared to me so far</Text>
        </View>
      </GradientContainer>
    </BlurView>
  </View>
}

export default memo(EterneLogo);

const styles = StyleSheet.create({
  container: {
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
})