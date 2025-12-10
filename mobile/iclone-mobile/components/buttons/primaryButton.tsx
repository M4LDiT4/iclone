import React from "react";
import { TouchableOpacity, StyleSheet, Text, ViewStyle, TextStyle } from "react-native";
import { Center } from "../layout/layout";
import { hexToRgba } from "@/core/utils/colorHelpers";

type PrimaryButtonProps = {
  label?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
};

export default function PrimaryButton({
  label,
  icon,
  children,
  onPress,
  style,
  labelStyle,
}: PrimaryButtonProps) {
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
    backgroundColor: hexToRgba("#005BFF", 0.85),
    borderRadius: 10,
    height: 47,
  },
  labelText: {
    color: "white",
    fontWeight: "500", // use string for RN
    fontFamily: "SFProText",
  },
});