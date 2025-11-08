import MessageContainer from '@/components/chat/ChatBubble';
import database from '@/data/database/index.native';
import MessageModel from '@/data/database/models/messageModel';
import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
  const [messageList, setMessageList] = useState<string[]>([]);
  const [message, setMessage] = useState<string|null>(null);

  function addMessage(newMessage:string){
    setMessageList(prev => [...prev, newMessage])
  }

  function handleTextinputChange(newText:string){
    setMessage(newText);
  }

  function resetMessage(){
    setMessage(null);
  }

  function handleSendButtonPress(){
    if(message === null || message.length === 0){
      return;
    }
    addMessage(message);
    resetMessage();
  }

  async function saveMessage(message: string){
    await database.write(
      async () => {
        await database.get<MessageModel>('messages').create(
          msg => {
            msg.content = message,
            msg.sender = 'user'
          }
        );
      }
    );
  } 
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <FlatList
          data={messageList} // placeholder for messages
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>(
              <MessageContainer
                message={item}
                saveMessage={saveMessage}
              />
            )
          }
          contentContainerStyle={styles.messageList}
          inverted
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            onChangeText={handleTextinputChange}
            value={message??""}
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendButtonPress}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  container: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    paddingBottom: 100,
  },
  messageBubble: {
    backgroundColor: '#E1F5FE',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 24,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  sendText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});