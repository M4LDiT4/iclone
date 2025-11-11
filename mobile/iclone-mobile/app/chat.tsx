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
import AppColors from "@/core/styling/AppColors";
import ChatTextinput from "@/components/textinputs/chatTextinput";
import { memo, useEffect, useState } from "react";
import Logo from "../assets/svg/llm_logo.svg";

export default function ChatScreen() {
  return (
    <SafeAreaView edges={["left", "right"]} style={styles.screenContainer}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style ={styles.logoContainer}>
            <Logo
              width={116}
              height={116}
            />
            <View style = {styles.listeningTextContainer}>
              <Text>Listening...</Text>
            </View>
          </View>
        </ScrollView>
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
  },
  textinputContainer: {
    paddingTop: 8,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'relative'
  },
  listeningTextContainer: {
    position: 'absolute',
    borderRadius: 10,
    padding: 16,
    bottom: 0,
  }

});
