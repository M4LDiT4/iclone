import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

type FrostedCardProps = {
  children: React.ReactNode;
  tintColor?: string; // e.g., 'rgba(80,171,231,0.2)' or '#50ABE7'
};

export default function FrostedCard({ children, tintColor }: FrostedCardProps) {
  return (
    <BlurView
      intensity={60}
      tint="light"
      style={[styles.container, tintColor && { backgroundColor: tintColor }]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.15)', // default fallback
    padding: 8,
  } as ViewStyle,
});