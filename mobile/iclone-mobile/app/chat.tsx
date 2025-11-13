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
import { memo, useEffect, useState } from "react";
import Logo from "../assets/svg/llm_logo.svg";
import Color from "color";
import ChatBubble from "@/components/chat/ChatBubble";

export default function ChatScreen() {
  return (
    <SafeAreaView edges={["left", "right"]} style={styles.screenContainer}>
      {/* HEADER */}
      <View style={styles.headerWrapper}>
        {/* Gradient background */}
        <LinearGradient
          colors={[
            "transparent", // bottom = fully transparent
            Color(AppColors.backgroundColor).alpha(0.85).rgb().string(), // mid fade
            AppColors.backgroundColor, // top = opaque
          ]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Optional frosted blur effect */}
        <BlurView
          tint="light"
          intensity={40}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.logoContainer}>
          <Logo width={116} height={116} />
          <View style={styles.listeningTextContainer}>
            <Text style={styles.listeningText}>Listening...</Text>
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
        >
          <ChatBubble
            content="Hey! Are we still on for tonight?"
            sentByUser={true}
            isLastByUser={false}
          />

          <ChatBubble
            content="Just finished the mockups. Want to take a look?"
            sentByUser={true}
            isLastByUser={false}
          />

          <ChatBubble
            content="Yes, I’ll be there by 7. Let’s meet at the usual spot."
            sentByUser={false}
          />


          <ChatBubble
            content="Just finished the mockups. Want to take a look?"
            sentByUser={true}
            isLastByUser={false}
          />

          <ChatBubble
            content="Yes, I’ll be there by 7. Let’s meet at the usual spot."
            sentByUser={false}
          />

          <ChatBubble
            content="Here’s the full breakdown of the architecture: we’ll use modular services, persistent memory, and index-based repair logic for the agent system."
            sentByUser={true}
            isLastByUser={true}
          />

          <ChatBubble
            content="Sounds solid. I’ll review the schema tonight and push the updated endpoints by morning."
            sentByUser={false}
          />
        </ScrollView>

        {/* INPUT */}
        <ChatInputWrapper />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const ChatInputWrapper = memo(() => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <View
      style={{
        ...styles.textinputContainer,
        paddingBottom: keyboardVisible ? 36 : 0,
      }}
    >
      <ChatTextinput value="" onChangeText={() => {}} onSend={() => {}} />
    </View>
  );
});

ChatInputWrapper.displayName = "ChatInputWrapper";

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
    paddingTop: 180, // add top padding so chat starts below header
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
