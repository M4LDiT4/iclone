import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppColors from '@/core/styling/AppColors';
import ChatTextinput from './chatTextinput';

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
    <View style={{ ...styles.container, paddingBottom: keyboardVisible ? 36 : 0 }}>
      <TouchableOpacity onPress={onLeftButton1} style={styles.leftButton}>
        <Ionicons name="camera-outline" size={24} color={AppColors.primaryColor} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onLeftButton2} style={styles.leftButton}>
        <Ionicons name="mic-outline" size={24} color={AppColors.primaryColor} />
      </TouchableOpacity>

      <ChatTextinput
        value={value}
        onChangeText={onChangeText}
        onSend={onSend}
      />
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
});