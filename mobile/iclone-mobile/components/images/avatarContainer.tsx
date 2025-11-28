import React from 'react';
import { View, StyleSheet } from 'react-native';
import SmartImage from './smartImage';

export default function AvatarContainer({
  size = 64,
  source,
  fallbackImage,
  fallbackIcon,
}: {
  size?: number;
  source: string | any; // URL or require()
  fallbackImage?: any;  // optional local image
  fallbackIcon?: React.ReactNode; // optional icon fallback
}) {
  return (
    <View
      style={[
        styles.border,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <SmartImage
        source={source}
        fallbackImage={fallbackImage}
        fallbackIcon={fallbackIcon}
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
