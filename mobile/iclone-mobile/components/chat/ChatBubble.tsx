import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Color from 'color';
import AppColors from '@/core/styling/AppColors';

export type ChatBubbleProps = {
  content: string;
  sentByUser: boolean;
  index: number; // add index prop
};

export default function ChatBubble({ content, sentByUser, index }: ChatBubbleProps) {
  const alignment = sentByUser ? 'flex-end' : 'flex-start';
  const bubbleColor = sentByUser
    ? Color(AppColors.secondaryColor).alpha(0.2).rgb().string()
    : Color(AppColors.primaryColor).alpha(0.1).rgb().string();

  // Animated values
  const opacity = useRef(new Animated.Value(index === 0 ? 0 : 1)).current;
  const translateY = useRef(new Animated.Value(index === 0 ? 20 : 0)).current;
  const scale = useRef(new Animated.Value(index === 0 ? 0.9 : 1)).current;

  useEffect(() => {
    if (index === 0) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [index, content]);

  return (
    <View style={[styles.container, { alignItems: alignment }]}>
      <Animated.View
        style={[
          styles.contentContainer,
          {
            backgroundColor: bubbleColor,
            alignSelf: alignment,
            opacity,
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        <Text style={styles.contentText}>{content}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 21,
    position: 'relative',
  },
  contentContainer: {
    maxWidth: '85%',
    borderRadius: 10,
    padding: 12,
  },
  contentText: {
    fontFamily: 'SFProText',
    fontWeight: '400',
    fontSize: 15,
    color: AppColors.primaryColor,
    flexWrap: 'wrap',
  },
});