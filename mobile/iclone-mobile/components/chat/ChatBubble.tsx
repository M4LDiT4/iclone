import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Color from 'color';
import AppColors from '@/core/styling/AppColors';
import AvatarContainer from '../images/avatarContainer';

type ChatBubbleProps = {
  content: string;
  sentByUser: boolean;
  isLastByUser?: boolean; // indicates if it's the last message in a sequence
};

export default function ChatBubble({ content, sentByUser, isLastByUser = false }: ChatBubbleProps) {
  const alignment = sentByUser ? 'flex-end' : 'flex-start';
  const bubbleColor = sentByUser
    ? Color(AppColors.secondaryColor).alpha(0.2).rgb().string()
    : Color(AppColors.primaryColor).alpha(0.1).rgb().string();

  return (
    <View style={[styles.container, { alignItems: alignment }]}>
      {/* Show avatar only if NOT sent by user and is the last in the group */}
      {!sentByUser && isLastByUser && (
        <View style={[styles.avatarContainer, { left: -1 }]}>
          <AvatarContainer
            size={42}
            source={require('../../assets/images/react-logo.png')}
          />
        </View>
      )}

      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: bubbleColor,
            alignSelf: alignment,
            marginLeft: sentByUser ? 40 : 0,
            marginRight: sentByUser ? 20 : 0,
            borderRadius: 10,
          },
        ]}
      >
        <Text style={styles.contentText}>{content}</Text>
      </View>

      {/* ✅ Only show avatar if it's sent by the user AND it's the last by the user */}
      {sentByUser && isLastByUser && (
        <View style={[styles.avatarContainer, { right: -1 }]}>
          <AvatarContainer
            size={42}
            source={require('../../assets/images/react-logo.png')}
          />
        </View>
      )}
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
