import React from "react";
import { TouchableOpacity, StyleSheet, Text, ViewStyle, TextStyle } from "react-native";
import { Center } from "../layout/layout";
import { hexToRgba } from "@/core/utils/colorHelpers";

type OutlineButtonProps = {
  label?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
};

export default function OutlineButton({
  label,
  icon,
  children,
  onPress,
  style,
  labelStyle,
}: OutlineButtonProps) {
  return (
    <TouchableOpacity style={[styles.mainContainer, style]} onPress={onPress}>
      <Center style={{ flexDirection: "row", flex: 1 }}>
        {children ? (
          children
        ) : (
          <>
            {icon && <Center style={{ marginRight: label ? 6 : 0 }}>{icon}</Center>}
            {label && <Text style={[styles.labelText, labelStyle]}>{label}</Text>}
          </>
        )}
      </Center>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "transparent", // 👈 transparent background
    borderRadius: 10,
    width: "100%",
    height: 47,
    borderWidth: 1,
    borderColor: hexToRgba("#005BFF", 0.85), // 👈 outline color
  },
  labelText: {
    color: hexToRgba("#005BFF", 0.85), // 👈 text matches border
    fontWeight: "500",
    fontFamily: "SFProText",
  },
});