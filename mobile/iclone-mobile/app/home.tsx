import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import AppColors from '@/core/styling/AppColors';
import Logo from '../assets/svg/llm_logo.svg';

import ChatBasicDetailsCard from '@/components/containers/chatBasicDetailsCard';
import ChatInputBar from '@/components/textinputs/chatInputBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacer } from '@/components/layout/layout';
import { useAuth } from '@/core/contexts/authContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import GlobalStyles from '@/core/styling/GlobalStyles';
import HomeHeader from '@/components/headers/homeHeader';
import ComponentStatus from '@/core/types/componentStatusType';
import ChatRepository from '@/services/localDB/ChatRepository';
import database from '@/data/database/index.native';
import { ActivityIndicator } from 'react-native-paper';


export default function HomeScreen() {
  const auth = useAuth();
  const router = useRouter();
  
  const [componentStatus, setComponentStatus] = useState<ComponentStatus>('idle');
  const [chatRepository, setChatRepository] = useState<ChatRepository| null>(null);

  useEffect(() => {
    if(!auth) return;
    try{
      setComponentStatus("initializing");
      const newChatRepo = new ChatRepository({database: database, userId: auth?.user?.uid!});
      setChatRepository(newChatRepo);
      setComponentStatus('idle');
    }catch(err){
      console.error(`Failed to initialize the home screen: ${err}`);
      setComponentStatus("error");
    }
  }, [auth]);

  const gotoMemoryList = () => {
    // prevent navigation to another screen if initializing
    if(componentStatus === 'initializing') return;
    router.push("/memory/memoryList");
  }

  const handleTemplatePress = async (message: string) => {
    // do not attempt to create chat if component is still initializing or chatRepository 
    // is null
    if(componentStatus === 'initializing' || !chatRepository) return;
    try{
      setComponentStatus('initializing');
      const newChat = await chatRepository?.createNewChat();
      router.push({
        pathname: `/chat/[chatId]`,
        params: {
          chatId: newChat.id,
          userMessage: message,
          // we assert that profile exists
          // if this throws an error, the authentication is either broken or there is a
          // problem on the auth state or AuthContext
          username: auth!.profile!.username
        }
      })
    }catch(err){
      console.error(`Failed to create a new chat: ${err}`);
      // you can set an error state here if necessary
    }finally{
      setComponentStatus("idle");
    }
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <LinearGradient
        colors={["#6C9BCF", "#F8F9FA"]}
        style={GlobalStyles.screenGradientTop}
      />
      <HomeHeader/>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.upperContainer}>
            <Text style={styles.primaryText}>{`Hello, ${auth?.profile?.username ?? auth?.user?.displayName ?? "Guest"}`}</Text>
            <Spacer height={8}/>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <TouchableOpacity 
              onPress={gotoMemoryList} 
              style={styles.svgContainer}
            >
              <Logo />
            </TouchableOpacity>
          </View>

          <View style={styles.lowerContainer}>
            <Text style={styles.primaryText}>Do you have stories for me?</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storiesContainer}
            >
              <ChatBasicDetailsCard
                iconName="heart-outline"
                iconColor={AppColors.primaryColor}
                label="Family Traditions and holidays"
                chatWithTemplate={() => handleTemplatePress("I’d like to share a story about how my family celebrates special occasions.”")}
              />
              <Spacer width={8} />
              <ChatBasicDetailsCard
                iconName="bulb-outline"
                iconColor={AppColors.primaryColor}
                label="Lessons from your career"
                chatWithTemplate={ () => handleTemplatePress("I’d like to share an experience from my career that taught me something valuable.")}
              />
              <Spacer width={8} />
              <ChatBasicDetailsCard
                iconName="time-outline"
                iconColor={AppColors.primaryColor}
                label="Your childhood home and memories"
                chatWithTemplate={ () => handleTemplatePress("I’d like to share a memory from my childhood and what it meant to me.")}
              />
              <Spacer width={8} />
              <ChatBasicDetailsCard
                iconName="chatbubble-ellipses-outline"
                iconColor={AppColors.primaryColor}
                label="Advice for important life moments"
                chatWithTemplate={() => handleTemplatePress("I’d like to share some advice that could help during meaningful life transitions.")}
              />
            </ScrollView>
          </View>
        </ScrollView>
        <ChatInputBar
          username={auth!.profile!.username}
          chatRepo={chatRepository!}
          componentStatus={componentStatus}
          setComponentStatus={setComponentStatus}
        />
      </KeyboardAvoidingView>
      <LinearGradient
        colors={["#F8F9FA", "#6C9BCF"]}
        style={GlobalStyles.screenGradientBottom}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.backgroundColor,
    paddingBottom: 48
  },
  wrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  primaryText: {
    fontFamily: 'SFProText',
    fontWeight: 'bold',
    fontSize: 30,
    color: AppColors.primaryColor,
    padding: 0,
    margin: 0,
    lineHeight: 32,
    letterSpacing: -1,
    textAlign: 'center',
  },
  welcomeText: {
    fontFamily: 'SFProText',
    fontWeight: 'bold',
    fontSize: 16,
    color: AppColors.secondaryColor,
    lineHeight: 18,
  },
  svgContainer: {
    paddingVertical: 32,
  },
  upperContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lowerContainer: {
    flex: 2,
  },
  storiesContainer: {
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  viewMoreButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  viewMoreText: {
    color: AppColors.primaryColor,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'SFProText',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // optional, keeps it clean
  },
    initialScreenContainer : {
    backgroundColor: AppColors.backgroundColor,
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  titleText : {
    fontSize: 20,              // Larger than body text
    fontWeight: '700',         // Bold for emphasis
    color: '#023E65',          // Primary or brand color
    textAlign: 'center',       // Centered in the modal
    marginBottom: 12,          // Space below before content
    fontFamily: 'SFProText',   // Keep consistent with your app typography
  },
});