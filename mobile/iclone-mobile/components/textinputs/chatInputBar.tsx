import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppColors from '@/core/styling/AppColors';
import Color from 'color';

type ChatInputBarProps = {
  onSend: () => void;
  onLeftButton1: () => void;
  onLeftButton2: () => void;
  value: string;
  onChangeText: (text: string) => void;
};

export default function ChatInputBar({
  onSend,
  onLeftButton1,
  onLeftButton2,
  value,
  onChangeText,
}: ChatInputBarProps) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <View style={{... styles.container, paddingBottom: keyboardVisible ? 36 : 0}}>
      <TouchableOpacity onPress={onLeftButton1} style={styles.leftButton}>
        <Ionicons name="camera-outline" size={24} color={AppColors.primaryColor} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onLeftButton2} style={styles.leftButton}>
        <Ionicons name="mic-outline" size={24} color={AppColors.primaryColor} />
      </TouchableOpacity>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          // value={value}
          onChangeText={onChangeText}
          placeholder="What do you want to share"
          placeholderTextColor="#999"
          multiline={true}
          textAlignVertical="top"
        />
        <TouchableOpacity onPress={onSend} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#3498db" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButton: {
    marginRight: 8,
    paddingTop: 6,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center', 
    backgroundColor: Color(AppColors.primaryColor).alpha(0.1).rgb().string(),
    borderRadius: 10,
    padding: 12
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    padding: 0,
    textAlignVertical: 'center', // center text vertically
    minHeight: 0, // let it shrink naturally
  },
  sendButton: {
    marginLeft: 8,
    paddingTop: 4,
  },
});