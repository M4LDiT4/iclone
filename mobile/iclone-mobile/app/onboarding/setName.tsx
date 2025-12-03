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
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AppColors from "@/core/styling/AppColors";
import Logo from "../../assets/svg/llm_logo.svg";
import { BlurView } from "expo-blur";
import GradientContainer from "@/components/containers/gradientContainer";
import GenericTextInput, { GenericTextInputHandle } from "@/components/textinputs/genericTextInput";
import { Ionicons } from "@expo/vector-icons";
import { useOnboardingContext } from "@/core/contexts/onboardingContext";
import { AppValidators } from "@/core/utils/appValidators";

function SetNameScreen() {
  const {setName} = useOnboardingContext();
  const textRef = useRef<GenericTextInputHandle>(null);

  const onPress = () => {
    if(textRef.current?.validate()) {
      setName(textRef.current?.getValue());
      // proceed to next
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

          {/* Logo + Floating Text */}
          <View style={styles.logoContainer}>
            <Logo />
            <View style={styles.logoTextContainer}>
              <GradientContainer width={158} opacity={0.6} borderRadius={10}>
                <BlurView
                  intensity={30}
                  tint="light"
                  style={styles.logoTextBlurView}
                >
                  <Text style={styles.logoText}>
                    How do you want me to call you?
                  </Text>
                </BlurView>
              </GradientContainer>
            </View>
          </View>
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