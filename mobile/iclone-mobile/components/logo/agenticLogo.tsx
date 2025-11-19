import { Text, StyleSheet } from "react-native";
import Logo from '../../assets/svg/llm_logo.svg';
import {Center, Padding, Stack } from "../layout/layout";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import AppColors from "@/core/styling/AppColors";
export default function AgenticLogo() {
  return (
    <Stack>
      <Padding bottom={16}>
        <Center>
          <Logo width={116} height={116}/>
          <LinearGradient
            colors={['rgba(237,242,251,0.5)', 'rgba(186,224,243,0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style = {styles.gradientLabelContainer}
          >
            <Padding all={8}>
              <BlurView
                intensity={20}
                tint="light"
              >
                <Text style = {styles.labelText}>
                  These are what you shared to me so far
                </Text>
              </BlurView>
            </Padding>
          </LinearGradient>
        </Center>
      </Padding>
    </Stack>
  )
}

const styles = StyleSheet.create ({
  gradientLabelContainer: {
    position: 'absolute',
    bottom: -16,
    borderRadius: 10
  },
  labelText : {
    fontFamily: 'SFProText',
    fontWeight: 700,
    fontSize: 12,
    color: AppColors.primaryColor,
    lineHeight: 12
  }
})