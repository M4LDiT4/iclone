// ChatScreen.tsx
import {FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ChatHeader from "@/components/headers/chatHeader";
import { StatusBar } from "expo-status-bar";
import AppColors from "@/core/styling/AppColors";

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
      header: () =>  <ChatHeader
          label="Converse"
          chatId={chatId as string}
          onSave={(id) => console.log("Save conversation:", id)}
        />
    })
  }, [navigation, chatId]);

  if (isInitializing) return <LoadingScreen/>;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style ={{flex:1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <Padding style={{flex:1, paddingHorizontal: 16}}>
          <Stack style = {{flex: 1}}>
            <FlatList
              ref={flatListRef}
              inverted
              style={{ flex: 1,}}
              contentContainerStyle={{paddingTop: isUserTyping ? 50 : 0}}
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
          <View style ={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}>
            <TouchableOpacity style = {{padding: 8, justifyContent: 'center', alignItems: 'center'}}>
              <Ionicons size={46} name="save-outline" color={AppColors.primaryColor}/>
            </TouchableOpacity>
           <View style ={{flex: 1}}>
             <ChatInputWrapper
              handleSend={pushUserMessage}
              triggerLLMResponse={generateResponse}
              setIsUserTyping={setIsUserTyping}
              isUserTyping={isUserTyping}
            />
           </View>
          </View>
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
});

