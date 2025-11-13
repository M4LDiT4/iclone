import { SafeAreaView } from "react-native-safe-area-context";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import AppColors from "@/core/styling/AppColors";
import ChatTextinput from "@/components/textinputs/chatTextinput";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import Logo from "../assets/svg/llm_logo.svg";
import Color from "color";
import ChatBubble, { ChatBubbleProps } from "@/components/chat/ChatBubble";
import TypingIndicator from "@/components/texts/typingIndicator";

import DeepSeekClient from "@/domain/llm/deepSeek/model";

export default function ChatScreen() {
  const [error, setError] = useState<string | null>(null);
  const [userActivity, setUserActivity] = useState<"listening" | "typing">("listening");
  const scrollViewRef = useRef<ScrollView>(null);
  const [messageList, setMessageList] = useState<ChatBubbleProps[]>([]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messageList, userActivity]);

  // Initialize the LLM
  const llmModel = useMemo(() => {
    const deepSeekApiKey = process.env.EXPO_PUBLIC_DEEP_SEEK_API_KEY;
    if (!deepSeekApiKey) {
      setError("Missing DeepSeek API key. Please check your environment configuration.");
      return null;
    }
    return new DeepSeekClient(deepSeekApiKey);
  }, []);

  // Push a user message to the list
  const handlePushUserMessage = (content: string) => {
    const newMessage: ChatBubbleProps = {
      content,
      sentByUser: true,
      isLastByUser: false,
    };
    setMessageList(prev => [...prev, newMessage]);
    setUserActivity("listening");
  };

  function waitFiveSeconds(): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("Done waiting 5 seconds!");
      }, 5000); // 5000 milliseconds = 5 seconds
    });
  }


  // Trigger the LLM after user has sent message and stopped typing / closed keyboard
  const triggerLLMResponse = async (latestUserMessage: string) => {
    if (!llmModel) return;
    try {

      setUserActivity("typing");

      // Replace this with your actual DeepSeek API call
      const response = await llmModel.call(latestUserMessage);

      const assistantMessage: ChatBubbleProps = {
        content: response,
        sentByUser: false,
        isLastByUser: false,
      };

      setMessageList(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error("LLM Error:", err);
      setError("Failed to get response from DeepSeek.");
    } finally {
      setUserActivity("listening");
    }
  };

  if (error) {
    return (
      <SafeAreaView edges={["left", "right"]} style={styles.screenContainer}>
        <View style={styles.headerWrapper}>
          <Text style={{ color: "red", fontWeight: "bold", fontSize: 16 }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.screenContainer}>
      {/* HEADER */}
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={[
            "transparent",
            Color(AppColors.backgroundColor).alpha(0.85).rgb().string(),
            AppColors.backgroundColor,
          ]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <BlurView tint="light" intensity={40} style={StyleSheet.absoluteFill} />
        <View style={styles.logoContainer}>
          <Logo width={116} height={116} />
          <View style={styles.listeningTextContainer}>
            <Text style={styles.listeningText}>
              {userActivity === "typing" ? "Typing..." : "Listening..."}
            </Text>
          </View>
        </View>
      </View>

      {/* CHAT BODY */}
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          ref={scrollViewRef}
        >
          {messageList.map((props, index) => (
            <ChatBubble
              key={index}
              content={props.content}
              sentByUser={props.sentByUser}
              isLastByUser={props.isLastByUser}
            />
          ))}

          {userActivity === "typing" && (
            <TypingIndicator/>
          )}
        </ScrollView>


        {/* INPUT */}
        <ChatInputWrapper
          handleSend={handlePushUserMessage}
          triggerLLMResponse={triggerLLMResponse}
          setUserActivity={setUserActivity}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const ChatInputWrapper = memo(
  ({
    handleSend,
    triggerLLMResponse,
    setUserActivity,
  }: {
    handleSend: (content: string) => void;
    triggerLLMResponse: (latestUserMessage: string) => void;
    setUserActivity: (activity: "listening" | "typing") => void;
  }) => {
    const [message, setMessage] = useState<string>("");
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const lastSentMessageRef = useRef<string | null>(null);
    const typingTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
      const showSub = Keyboard.addListener("keyboardDidShow", () => {
        setKeyboardVisible(true);
        setUserActivity("listening");
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
      setUserActivity("listening");

      // Cancel pending LLM trigger if user resumes typing
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };

    const handleSendButtonPress = () => {
      const trimmed = message.trim();
      if (trimmed.length === 0) return;

      handleSend(trimmed);
      lastSentMessageRef.current = trimmed;
      setMessage("");

      // Start 2s timeout to trigger LLM
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        if (lastSentMessageRef.current) {
          triggerLLMResponse(lastSentMessageRef.current);
          lastSentMessageRef.current = null;
        }
      }, 1000);
    };

    return (
      <View
        style={{
          ...styles.textinputContainer,
          paddingBottom: keyboardVisible ? 36 : 0,
        }}
      >
        <ChatTextinput
          value={message}
          onChangeText={handleMessageChange}
          onSend={handleSendButtonPress}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: AppColors.backgroundColor,
    paddingBottom: 16,
  },
  wrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 180, // ensures chat starts below header
  },
  textinputContainer: {
    paddingTop: 8,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    zIndex: 2,
  },
  logoContainer: {
    alignItems: "center",
  },
  listeningTextContainer: {
    backgroundColor: Color(AppColors.secondaryColor).alpha(0.5).rgb().string(),
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 8,
    overflow: "hidden",
  },
  listeningText: {
    fontFamily: "SFProText",
    fontWeight: "bold",
    fontSize: 12,
    lineHeight: 14,
    color: AppColors.primaryColor,
  },
});
