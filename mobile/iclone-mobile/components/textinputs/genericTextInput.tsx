import React from "react";
import { TextInput, TextInputProps, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { hexToRgba } from "@/core/utils/colorHelpers";

type GenericTextInputProps = TextInputProps & {
  containerStyle?: ViewStyle;
};

export default function GenericTextInput({
  containerStyle,
  style,
  placeholder = "Enter text",
  placeholderTextColor = hexToRgba("#023E65", 0.6),
  ...props
}: GenericTextInputProps) {
  return (
    <LinearGradient
      colors={["rgba(237, 242, 251, 0.5)", "rgba(80, 171, 231, 0.5)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        {
          paddingHorizontal: 8,
          width: "100%",
          borderRadius: 10,
          overflow: "hidden",
        },
        containerStyle,
      ]}
    >
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={[
          {
            height: 47,
            fontSize: 14,
            padding: 0
          },
          style,
        ]}
        {...props}
      />
    </LinearGradient>
  );
}