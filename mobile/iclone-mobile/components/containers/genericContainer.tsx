import React from 'react';
import { View, ViewStyle } from 'react-native';
import Color from 'color';

type TintedContainerProps = {
  height?: number;
  width?: number;
  tintColor?: string;
  opacity?: number; // 0 to 1
  borderRadius? :number,
  children?: React.ReactNode;
};

export default function GenericContainer({
  height,
  width,
  tintColor = '#3498db',
  opacity = 0.1,
  borderRadius = 0.8,
  children,
}: TintedContainerProps){
  const backgroundColor = Color(tintColor).alpha(opacity).rgb().string();

  const containerStyle: ViewStyle = {
    height,
    width,
    backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius,
  };

  return <View style={containerStyle}>{children}</View>;
}