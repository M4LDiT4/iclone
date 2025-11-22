import React from "react";
import { View, ViewStyle } from "react-native";

type DividerProps = {
  color?: string;          // Line color
  thickness?: number;      // Line thickness
  marginVertical?: number; // Spacing above/below
  style?: ViewStyle;       // Extra custom styles
};

export default function Divider({
  color = "#ccc",
  thickness = 1,
  marginVertical = 12,
  style,
}: DividerProps) {
  return (
    <View
      style={[
        {
          height: thickness,
          backgroundColor: color,
          marginVertical,
          width: "100%",
        },
        style,
      ]}
    />
  );
}