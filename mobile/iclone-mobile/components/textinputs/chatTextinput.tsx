// ChatTextinput.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppColors from '@/core/styling/AppColors';
import Color from 'color';
import ComponentStatus from '@/core/types/componentStatusType';

type ChatTextInputGroupProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  componentStatus: ComponentStatus;
};

export default function ChatTextinput({
  value,
  onChangeText,
  onSend,
  componentStatus,
}: ChatTextInputGroupProps) {
  const renderSendIcon = () => {
    switch (componentStatus) {
      case 'loading':
        return <Ionicons name="time-outline" size={20} color={AppColors.primaryColor} />;
      case 'error':
        return <Ionicons name="alert-circle-outline" size={20} color="red" />;
      default:
        return <Ionicons name="send" size={20} color="#3498db" />;
    }
  };

  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="What do you want to share"
        placeholderTextColor="#999"
        multiline
        textAlignVertical="top"
      />
      <TouchableOpacity onPress={onSend} style={styles.sendButton}>
        {renderSendIcon()}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color(AppColors.primaryColor).alpha(0.1).rgb().string(),
    borderRadius: 10,
    padding: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    padding: 0,
    textAlignVertical: 'center',
    minHeight: 0,
  },
  sendButton: {
    marginLeft: 8,
    paddingTop: 4,
  },
});