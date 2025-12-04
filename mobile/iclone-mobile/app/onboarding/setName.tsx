import React, { memo, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AppColors from "@/core/styling/AppColors";
import GenericTextInput, { GenericTextInputHandle } from "@/components/textinputs/genericTextInput";
import { Ionicons } from "@expo/vector-icons";
import { useOnboardingContext } from "@/core/contexts/onboardingContext";
import { AppValidators } from "@/core/utils/appValidators";
import { useRouter } from "expo-router";
import LogoWithFloatingText from "@/components/logo/logoWithFloatingText";

function SetNameScreen() {
  const router = useRouter();
  const {setName} = useOnboardingContext();
  const textRef = useRef<GenericTextInputHandle>(null);

  const onPress = () => {
    if(textRef.current?.validate()) {
      setName(textRef.current?.getValue());
      router.replace("/onboarding/setBirthDate");
    } 
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Circular Gradient */}
      <LinearGradient
        colors={["#6C9BCF", "#F8F9FA"]}
        style={styles.topGradient}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Scrollable content */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.mainText}>
            Hello, I am Eterne!{" "}
            <Text style={styles.highlightText}>Your companion</Text> in
            preserving your memory for your legacy.
          </Text>

          <LogoWithFloatingText text="How do you want me to call you?" width={158} />
        </ScrollView>

        {/* Fixed Input Bar at Bottom */}
        <View style={styles.textinputContainer}>
          <View style={{ flex: 1 }}>
            <GenericTextInput containerStyle={styles.textinput} ref={textRef} validator={AppValidators.nonEmpty}/>
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={onPress}>
            <Ionicons name="send" size={20} color={AppColors.primaryColor} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Bottom Circular Gradient */}
      <LinearGradient
        colors={["#F8F9FA", "#6C9BCF"]}
        style={styles.bottomGradient}
      />
    </SafeAreaView>
  );
}

export default memo(SetNameScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: AppColors.backgroundColor,
  },
  topGradient: {
    position: "absolute",
    top: -50,
    left: -50,
    right: -50,
    height: 200,
    borderRadius: 200,
    zIndex: -1,
  },
  bottomGradient: {
    position: "absolute",
    bottom: -150,
    left: -50,
    right: -50,
    height: 200,
    borderRadius: 200,
    zIndex: -1,
  },
  mainText: {
    fontFamily: "SFProText",
    fontWeight: "bold",
    fontSize: 31,
    color: AppColors.primaryColor,
  },
  highlightText: {
    color: AppColors.secondaryColor,
  },
  logoContainer: {
    position: "relative",
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
  },
  logoTextContainer: {
    position: "absolute",
    bottom: -30,
  },
  logoTextBlurView: {
    padding: 8,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
  },
  logoText: {
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: "SFProText",
    color: AppColors.primaryColor,
    textAlign: "center",
  },
  textinputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    backgroundColor: AppColors.backgroundColor,
  },
  textinput: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  sendButton: {
    height: 47,
    width: 47,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(80, 171, 231, 0.5)",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});