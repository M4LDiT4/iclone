import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import database from '@/data/database/index.native';
import MessageModel from '@/data/database/models/messageModel';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);

    try {
      await database.write(async () => {
        const messagesCollection = database.get<MessageModel>('messages');
        await messagesCollection.create(msg => {
          msg.content = message;
        });
      });
      setSaved(true);
    } catch (error) {
      console.error('Failed to save message:', error);
      setSaved(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Type your message:</Text>
      <TextInput
        style={styles.input}
        placeholder="Start chatting..."
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Check" onPress={handleSave} disabled={isSaving || !message.trim()} />

      <View style={styles.feedback}>
        {isSaving ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : saved ? (
          <Text style={styles.output}>✅ Message saved!</Text>
        ) : (
          <Text style={styles.output}>You said: {message}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  feedback: {
    marginTop: 16,
    alignItems: 'center',
  },
  output: {
    fontSize: 16,
    color: '#333',
  },
});