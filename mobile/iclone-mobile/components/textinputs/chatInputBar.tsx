import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppColors from '@/core/styling/AppColors';
import ChatTextinput from './chatTextinput';
import ComponentStatus from '@/core/types/componentStatusType';
import ChatDBService from '@/services/localDB/ChatDBService';
import database from '@/data/database/index.native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';



export default function ChatInputBar({username}:{username?:string|null}) {
  const [componentStatus, setComponentStatus] = useState<ComponentStatus>("idle");
  const [chatDBService, setChatDBService] = useState<ChatDBService>();
  const [message, setMessage] = useState<string | null>("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const router = useRouter();

  useEffect(() => {
    const chatDBService = new ChatDBService({ database, userId: "userId" });
    setChatDBService(chatDBService);

    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);


  const handleMessageChange = (newMessage: string) => {
    setMessage(newMessage);
  }

  const updateComponentStatus = (newStatus: ComponentStatus) => {
    setComponentStatus(newStatus);
  }
  
  function navigateToChatScreen (chatId: string) {
      router.push({
        pathname: `/chat/[chatId]`,
        params: {
          chatId: chatId,
          userMessage: message,
          username: username
        }
      });
    }

  const resetMessage = () => {
    setMessage(null);
  }

  const handleSend = async () => {
    if(!chatDBService){
      updateComponentStatus('error');
      return;
    }
    // prevent execution of write operation when
    // - currently loading
    // - message is undefined or empty string
    if(!message || message.length === 0 || componentStatus === 'initializing'){
      return;
    }
    updateComponentStatus('initializing');
    await chatDBService?.createNewChat()
    .then((chat) => {
      updateComponentStatus('idle');
      setTimeout(() => {
        navigateToChatScreen(chat.id);
      }, 0);
    }).catch((err) => {
      console.error(`Failed to create new chat:  ${err}`);
      updateComponentStatus('error');
    });
    resetMessage();
  }

  const handleRecordAudio = () => {
    // TODO implement recording audio logic
  }

  const handlePickImage = () => {
    // TODO implement picking image logic
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={{ ...styles.container, paddingBottom: keyboardVisible ? 36 + insets.bottom : 0 }}>
      <TouchableOpacity onPress={handlePickImage} style={styles.leftButton}>
        <Ionicons name="camera-outline" size={24} color={AppColors.primaryColor} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRecordAudio} style={styles.leftButton}>
        <Ionicons name="mic-outline" size={24} color={AppColors.primaryColor} />
      </TouchableOpacity>

      <ChatTextinput
        value={message ?? ""}
        onChangeText={handleMessageChange}
        onSend={handleSend}
        componentStatus={componentStatus}
      />
    </SafeAreaView>
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