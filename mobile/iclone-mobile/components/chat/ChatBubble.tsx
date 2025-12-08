import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Color from 'color';
import AppColors from '@/core/styling/AppColors';
import AvatarContainer from '../images/avatarContainer';

export type ChatBubbleProps = {
  content: string;
  sentByUser: boolean;
};

export default function ChatBubble({ content, sentByUser}: ChatBubbleProps) {
  const alignment = sentByUser ? 'flex-end' : 'flex-start';
  const bubbleColor = sentByUser
    ? Color(AppColors.secondaryColor).alpha(0.2).rgb().string()
    : Color(AppColors.primaryColor).alpha(0.1).rgb().string();

  return (
    <View style={[styles.container, { alignItems: alignment }]}>
      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: bubbleColor,
            alignSelf: alignment,
            borderRadius: 10,
          },
        ]}
      >
        <Text style={styles.contentText}>{content}</Text>
      </View>
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
  avatarContainer: {
    position: 'absolute',
    bottom: -21,
  },
});
