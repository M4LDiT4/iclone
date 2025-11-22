import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Color from 'color';

type GradientContainerProps = {
  height?: number;
  width?: number;
  colors?: readonly [string, string, ...string[]];
  opacity?: number; // 0 to 1
  borderRadius?: number;
  children?: React.ReactNode;
};

export default function GradientContainer({
  height,
  width,
  colors = [
    'rgba(237, 242, 251, 1)',
    'rgba(186, 224, 243, 1)',
  ],
  opacity = 1,
  borderRadius = 0,
  children,
}: GradientContainerProps) {

  const fadedColors = [
    Color(colors[0]).alpha(opacity).rgb().string(),
    Color(colors[1]).alpha(opacity).rgb().string(),
    ...colors.slice(2).map(c => Color(c).alpha(opacity).rgb().string()),
  ] as const;


  const containerStyle: ViewStyle = {
    height,
    width,
    borderRadius,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <View style={containerStyle}>
      <LinearGradient
        colors={fadedColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
      {children}
    </View>
  );
}
