import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or use react-native-vector-icons

type Status = 'saved' | 'error' | 'loading';

interface MessageContainerProps {
  message: string;
  saveMessage: (id:string) => Promise<void>;
}

export default function MessageContainer({message, saveMessage }: MessageContainerProps) {

  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    handleOnMount()
  }, []);

  async function handleOnMount() {
    await saveMessage(message)
    .then(()=> setStatus('saved'))
    .catch((err)=>{
      console.log(`Failed to saved message:  ${err}`);
      setStatus('error');
    })
  }

  return (
    <View style={[styles.bubble, statusStyles[status]]}>
      <View style={styles.row}>
        {status === 'loading' && <ActivityIndicator size="small" color="#555" />}
        {status === 'saved' && <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />}
        {status === 'error' && <Ionicons name="close-circle" size={20} color="#e74c3c" />}
        <Text style={styles.text}>
          {status === 'loading'
            ? 'Saving...'
            : status === 'saved'
            ? message || 'Message saved!'
            : 'Failed to save'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

const statusStyles = StyleSheet.create({
  saved: {
    backgroundColor: '#eafaf1',
    borderColor: '#2ecc71',
    borderWidth: 1,
  },
  error: {
    backgroundColor: '#fdecea',
    borderColor: '#e74c3c',
    borderWidth: 1,
  },
  loading: {
    backgroundColor: '#f0f0f0',
    borderColor: '#aaa',
    borderWidth: 1,
  },
});