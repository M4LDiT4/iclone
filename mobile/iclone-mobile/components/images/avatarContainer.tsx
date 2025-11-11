import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function AvatarContainer({
  size = 64,
  source,
}: {
  size?: number;
  source: any;
}) {
  return (
    <View style={[styles.border, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image
        source={source}
        style={{
          width: size - 4,
          height: size - 4,
          borderRadius: (size - 4) / 2,
        }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  border: {
    padding: 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});