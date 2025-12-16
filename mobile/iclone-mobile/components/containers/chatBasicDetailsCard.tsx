import React from 'react';
import { View, Text, ViewStyle, TextStyle, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GenericContainer from './genericContainer';
import { useRouter } from 'expo-router';

type chatBasicDetailsCardProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  containerStyle?: ViewStyle;
  iconSize?: number;
  textStyle?: TextStyle;
  chatWithTemplate: () => void
};

export default function chatBasicDetailsCard({
  iconName,
  iconColor,
  label,
  containerStyle,
  iconSize = 24,
  textStyle,
  chatWithTemplate
}: chatBasicDetailsCardProps) {
  const router = useRouter();

  const handleTemplatedChat = () => {
    chatWithTemplate();
  }
  return (
    <TouchableOpacity onPress={handleTemplatedChat}>
      <GenericContainer
        width={82} 
        height={76}
        borderRadius={10}
      >
        <View style={[styles.innerContainer, containerStyle]}>
          <View style={styles.iconWrapper}>
            <Ionicons name={iconName} size={iconSize} color={iconColor} />
          </View>
          <View style={styles.textWrapper}>
            <Text style={[styles.labelText, { color: iconColor }, textStyle]}>
              {label}
            </Text>
          </View>
        </View>
      </GenericContainer>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    padding: 8,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
  },
  iconWrapper: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  textWrapper: {
    flex: 1,
  },
  labelText: {
    fontFamily: 'SFProText',
    fontSize: 8,
    fontWeight: 'bold',
  },
});