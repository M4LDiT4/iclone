import { SafeAreaView } from "react-native-safe-area-context";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import AppColors from "@/core/styling/AppColors";
import ChatTextinput from "@/components/textinputs/chatTextinput";
import { memo, useEffect, useRef, useState } from "react";
import Logo from "../assets/svg/llm_logo.svg";
import Color from "color";
import ChatBubble, { ChatBubbleProps } from "@/components/chat/ChatBubble";
import TypingIndicator from "@/components/texts/typingIndicator";
import ChatService from "@/services/ChatService";
import DeepSeekClient from "@/domain/llm/deepSeek/model";
import SummaryService from "@/services/SummaryService";
import SummaryStackDBService from "@/services/localDB/SummaryStackDBService";
import database from "@/data/database/index.native";
import LocalMessageDBService from "@/services/localDB/LocalMessageDBService";
import { useLocalSearchParams } from "expo-router";
import SummaryStackDBService from "@/services/localDB/SummaryStackDBService";

export default function ChatScreen() {
  const { userMessage , chatId } = useLocalSearchParams();

  /** CLEAN STATE MODEL **/
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);

  const scrollViewRef = useRef<FlatList>(null);
  const [messageList, setMessageList] = useState<ChatBubbleProps[]>([]);
  const [chatService, setChatService] = useState<ChatService>();

  /** Auto-scroll **/
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messageList, isAssistantTyping, isUserTyping]);

  /** Initialize chat service once **/
  useEffect(() => {
    initializeChatService();
  }, []);

  /** Run logic AFTER chat service is available **/
  useEffect(() => {
    if (!chatService) return;

    const postInit = async () => {
      if (userMessage && typeof userMessage === "string") {
        await handlePushUserMessage(userMessage);
        await generateResponse();
      }
    };

    const getMessages = async () => {
      if (!chatService) return;

      const chatMessages = await chatService.getMessages();

      const bubbles: ChatBubbleProps[] = chatMessages.map((message) => ({
        content: message.content,
        sentByUser: message.sender === 'user',
        isLastByUser: false,
      }));

      // reset the messageList if chatservice refreshed/reloaded
      setMessageList(bubbles);

      if (chatMessages.length === 0) {
        await postInit();
      }
    };

    getMessages();
  }, [chatService]);

  /***********************
   * INIT CHAT SERVICE
   ************************/
  const initializeChatService = async () => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_DEEP_SEEK_API_KEY;
      if (!apiKey) {
        setError("Problem connecting to DeepSeek");
        return;
      }

      if (typeof chatId !== 'string' || !chatId.trim()) {
        setError("Invalid or missing chat ID");
        return;
      }

      const model = new DeepSeekClient(apiKey);
      const summaryService = new SummaryService(model);
      const summaryStackDBService = new SummaryStackDBService(database);
      const localMessageDBService = new LocalMessageDBService(database);

      const newChatService = new ChatService({
        chatId,
        username: "Helene",
        assistantName: "Eterne",
        slidingWindowSize: 3,
        summaryService,
        summaryStackDBService,
        localMessageDBService,
        llmModel: model,
      });

      console.log("Initializing ChatService with chatId:", chatId);
      await newChatService.initializeChat();
      setChatService(newChatService);
    } catch (err) {
      console.error("Failed to initialize chat service:", err);
      setError("Unexpected error occurred");
    } finally {
      setIsInitializing(false);
    }
  };

  /***********************
   * PUSH USER MESSAGE
   ************************/
  const handlePushUserMessage = async (content: string) => {
    if (!chatService) return;

    await chatService.insertNewMessage(content, "user");

    const newMessage: ChatBubbleProps = {
      content,
      sentByUser: true,
      isLastByUser: false,
    };

    setMessageList((prev) => [...prev, newMessage]);
  };

  /***********************
   * PUSH SYSTEM MESSAGE
   ************************/
  const handlePushSystemMessage = async (content: string) => {
    if (!chatService) return;

    await chatService.insertNewMessage(content, "system");

    const newMessage: ChatBubbleProps = {
      content,
      sentByUser: false,
      isLastByUser: false,
    };

    setMessageList((prev) => [...prev, newMessage]);
  };

  /***********************
   * GENERATE LLM RESPONSE
   ************************/
  const generateResponse = async () => {
    try {
      if (!chatService) return;

      setIsAssistantTyping(true);

      const response = await chatService.chat();
      await handlePushSystemMessage(response);
    } catch (err) {
      console.error("LLM Error:", err);
      setError("Failed to get response from DeepSeek.");
    } finally {
      setIsAssistantTyping(false);
    }
  };

  /***********************
   * ERROR & LOADING UI
   ************************/

  if (error && !chatService) {
    return (
      <SafeAreaView edges={["left", "right"]} style={styles.screenContainer}>
        <View style={styles.headerWrapper}>
          <Text style={{ color: "red", fontWeight: "bold", fontSize: 16 }}>
            {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isInitializing) {
    return (
      <SafeAreaView edges={["left", "right"]} style={styles.screenContainer}>
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
            <Text style={styles.listeningText}>Initializing chat service...</Text>
          </View>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primaryColor} />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </SafeAreaView>
    );
  }

  /***********************
   * MAIN CHAT UI
   ************************/
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
              {isAssistantTyping
                ? "Typing..."
                : isUserTyping
                ? "You’re typing..."
                : "Listening..."}
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
        <FlatList
          ref={scrollViewRef}
          data={[...messageList]}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <ChatBubble
              key={index}
              content={item.content}
              sentByUser={item.sentByUser}
              isLastByUser={item.isLastByUser}
            />
          )}
          ListFooterComponent={isAssistantTyping ? <TypingIndicator /> : null}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        />

        {/* INPUT */}
        <ChatInputWrapper
          handleSend={async (msg) => {
            await handlePushUserMessage(msg);
          }}
          triggerLLMResponse={generateResponse}
          setIsUserTyping={setIsUserTyping}
          isUserTyping = {isUserTyping}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/***********************
 * INPUT COMPONENT
 ************************/
const ChatInputWrapper = memo(
  ({
    handleSend,
    triggerLLMResponse,
    setIsUserTyping,
    isUserTyping,
  }: {
    handleSend: (content: string) => void | Promise<void>;
    triggerLLMResponse: () => void;
    setIsUserTyping: (val: boolean) => void;
    isUserTyping: boolean;
  }) => {
    const [message, setMessage] = useState<string>("");

    const lastSentMessageRef = useRef<string | null>(null);
    const typingTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
      const showSub = Keyboard.addListener("keyboardDidShow", () => {
        setIsUserTyping(true);
      });

      const hideSub = Keyboard.addListener("keyboardDidHide", () => {
        setIsUserTyping(false);
      });

      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, []);

    const handleMessageChange = (newMessage: string) => {
      setMessage(newMessage);
      setIsUserTyping(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };

    const handleSendButtonPress = async () => {
      const trimmed = message.trim();
      if (!trimmed) return;

      await handleSend(trimmed);
      lastSentMessageRef.current = trimmed;
      setMessage("");

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        if (lastSentMessageRef.current) {
          triggerLLMResponse();
          lastSentMessageRef.current = null;
        }
      }, 1000);
    };

    return (
      <View style={{ ...styles.textinputContainer, paddingBottom: isUserTyping ? 36 : 0}}>
        <ChatTextinput
          value={message}
          onChangeText={handleMessageChange}
          onSend={handleSendButtonPress}
          componentStatus="idle"
        />
      </View>
    );
  }
);

/***********************
 * STYLES
 ************************/
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
    paddingTop: 180,
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
  },
  listeningText: {
    fontFamily: "SFProText",
    fontWeight: "bold",
    fontSize: 12,
    color: AppColors.primaryColor,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    marginTop: 16,
    color: "red",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});
