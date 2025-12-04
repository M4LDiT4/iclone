import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import GradientContainer from "@/components/containers/gradientContainer";
import AppColors from "@/core/styling/AppColors";
import Logo from "../../assets/svg/llm_logo.svg";

interface LogoWithFloatingTextProps {
  text: string;
  width?: number;
}

const LogoWithFloatingText: React.FC<LogoWithFloatingTextProps> = ({ text, width = 158 }) => {
  return (
    <View style={styles.logoContainer}>
      <Logo />
      <View style={styles.logoTextContainer}>
        <GradientContainer width={width} opacity={0.6} borderRadius={10}>
          <BlurView intensity={30} tint="light" style={styles.logoTextBlurView}>
            <Text style={styles.logoText}>{text}</Text>
          </BlurView>
        </GradientContainer>
      </View>
    </View>
  );
};

export default LogoWithFloatingText;

const styles = StyleSheet.create({
  logoContainer: {
    position: "relative",
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
  },
  logoTextContainer: {
    position: "absolute",
    bottom: -30,
  },
  logoTextBlurView: {
    padding: 8,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
  },
  logoText: {
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: "SFProText",
    color: AppColors.primaryColor,
    textAlign: "center",
  },
});