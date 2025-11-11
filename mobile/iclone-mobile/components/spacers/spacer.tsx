import React from 'react';
import { View } from 'react-native';

type SpacerProps = {
  width?: number;
  height?: number;
};

export default function Spacer({ width = 0, height = 0 }: SpacerProps) {
  return <View style={{ width, height }} />;
}