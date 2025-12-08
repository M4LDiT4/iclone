// ChatScreen.tsx
import {FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import ChatBubble from "@/components/chat/ChatBubble";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChatViewModel } from "@/data/viewModels/ChatViewModel";
import ChatInputWrapper from "@/components/textinputs/chatInputWrapper";
import LoadingScreen from "@/components/notifiers/loadingScreen";
import { Column, Padding, Spacer, Stack } from "@/components/layout/layout";
import GenericModal from "@/components/modals/genericModal";
import PrimaryButton from "@/components/buttons/primaryButton";
import AssistantLogo from "@/components/chat/assistantLogo";
import { useLayoutEffect, useState } from "react";
import { Menu } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

export default function ChatScreen() {
  const { chatId, userMessage, username } = useLocalSearchParams();
  const {
    messageList,
    isInitializing,
    error,
    isError,
    isAssistantTyping,
    isUserTyping,
    flatListRef,
    setIsUserTyping,
    pushUserMessage,
    generateResponse,
    handleErrorModalCloseButtonPress,
  } = useChatViewModel(chatId as string|undefined, userMessage as string|undefined, username as string|undefined);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>  <KebabMenu chatId={chatId as string} onSave={()=>{}} />
    })
  }, [navigation, chatId]);

  if (isInitializing) return <LoadingScreen/>;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style ={{flex:1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 80} // sample offsets
      >
        <Padding style={{flex:1}} horizontal={16}>
          <Stack style = {{flex: 1}}>
            <FlatList
              ref={flatListRef}
              inverted
              style={{ flex: 1 }}
              contentContainerStyle={{paddingTop: 50}}
              data={messageList}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => <ChatBubble {...item} />}
              keyboardShouldPersistTaps="handled"
            />
            <AssistantLogo 
              type={(messageList.length> 2 || isUserTyping)? "small": 'large'}
              isUserTyping = {isUserTyping}
              isSystemTyping = {isAssistantTyping}
            />
          </Stack>
          <ChatInputWrapper
            handleSend={pushUserMessage}
            triggerLLMResponse={generateResponse}
            setIsUserTyping={setIsUserTyping}
            isUserTyping={isUserTyping}
          />
        </Padding>
        <GenericModal visible = {isError} onClose={() => {}}>
          <Column>
            <Padding style = {styles.signUpModalContainer}>
              <Text style = {styles.signUpModalTitleText}>{error ?? "Something went wrong"}</Text>
              <Spacer height={8}/>
              <PrimaryButton label="Okay" onPress={handleErrorModalCloseButtonPress}/>
            </Padding>
          </Column>
        </GenericModal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type KebabMenuProps = {
  chatId: string;
  onSave: (chatId: string) => void;
};

function KebabMenu({ chatId, onSave }: KebabMenuProps) {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <Pressable style={styles.iconButton} onPress={openMenu}>
          <MaterialIcons name="more-vert" size={24} color="#333" />
        </Pressable>
      }
    >
      <Menu.Item
        onPress={() => {
          onSave(chatId);
          closeMenu();
        }}
        title="Save Conversation"
      />
    </Menu>
  );
}



const styles = StyleSheet.create({
  container: {
     flex: 1,
  },
  scroll: { flex: 1 },
  signUpModalContainer : {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  signUpModalTitleText : {
    fontSize: 20,              // Larger than body text
    fontWeight: '700',         // Bold for emphasis
    color: '#023E65',          // Primary or brand color
    textAlign: 'center',       // Centered in the modal
    marginBottom: 12,          // Space below before content
    fontFamily: 'SFProText',   // Keep consistent with your app typography
  },
  iconButton: {
    padding: 8,              // touch target size
    borderRadius: 20,        // circular feel
    shadowColor: "#000",     // shadow on iOS
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    marginRight: 8,          // spacing from edge
  },

});

