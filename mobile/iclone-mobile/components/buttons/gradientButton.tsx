import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type ButtonState = "neutral" | "success" | "error";

interface GradientButtonProps {
  label: string;
  state?: ButtonState;
  onPress?: () => void;
}

// ✅ Typed gradient map as tuples
const gradientMap: Record<ButtonState, [string, string]> = {
  neutral: ["rgba(237, 242, 251, 0.5)", "rgba(80, 171, 231, 0.5)"],
  success: ["rgba(237, 242, 251, 0.5)", "rgba(123, 200, 164, 0.5)"],
  error: ["rgba(237, 242, 251, 0.5)", "rgba(201, 8, 8, 0.5)"],
};

const GradientButton: React.FC<GradientButtonProps> = ({
  label,
  state = "neutral",
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.touchable} onPress={onPress}>
      <LinearGradient
        colors={gradientMap[state]} // ✅ no TS error
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;

const styles = StyleSheet.create({
  touchable: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  gradient: {
    minHeight: 47,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "flex-start", // 👈 text aligned left
  },
  label: {
    fontSize: 14,
    color: "#023E65",
    fontWeight: "600",
  },
});