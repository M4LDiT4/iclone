import { Text, StyleSheet, ScrollView, TouchableHighlight, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { Column, Expanded, Padding, Row, Spacer, Stack } from "@/components/layout/layout";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../assets/svg/llm_logo.svg";
import AppColors from "@/core/styling/AppColors";
import { BlurView } from "expo-blur";
import { hexToRgba } from "@/core/utils/colorHelpers";
import GenericTextInput, { GenericTextInputHandle } from "@/components/textinputs/genericTextInput";
import PrimaryButton from "@/components/buttons/primaryButton";
import Divider from "@/components/spacer/divider";
import { FontAwesome } from "@expo/vector-icons";
import OutlineButton from "@/components/buttons/outlinedButton";
import { LinearGradient } from "expo-linear-gradient";
import GradientContainer from "@/components/containers/gradientContainer";
import { useRouter } from "expo-router";
import { AppValidators } from "@/core/utils/appValidators";
import { useRef, useState } from "react";
import GenericModal from "@/components/modals/genericModal";
import PhoneInput, { PhoneInputHandle } from "@/components/textinputs/phoneInput";

export default function SignUpScreen() {
  const router = useRouter();
  // textinput references
  const usernameRef = useRef<GenericTextInputHandle>(null);
  const emailRef = useRef<GenericTextInputHandle>(null);
  const contactNumRef = useRef<PhoneInputHandle>(null);
  const passwordRef = useRef<GenericTextInputHandle>(null);
  const confirmPassRef = useRef<GenericTextInputHandle>(null);
  
  // states
  const [isLoading, setIsLoading] = useState(false);


  const gotoSignIn = () => {
    router.replace('/signIn');
  }

  const confirmPasswordValidator = (value: string) => {
    const pass = passwordRef.current?.getValue() ?? "";

    if (!value || value.trim().length === 0) {
      return "Confirm password is required.";
    }

    if (pass !== value) {
      return "Passwords do not match.";
    }

    return null;
  };

  const isInputsValid = () => {
    const isUsernameValid = usernameRef.current?.validate();
    const isEmailValid = emailRef.current?.validate();
    const isContactNumValid = contactNumRef.current?.validate();
    const isPasswordValid = passwordRef.current?.validate();
    const isConfirmPassValid = confirmPassRef.current?.validate();

    return isUsernameValid && isEmailValid && isContactNumValid && isPasswordValid && isConfirmPassValid && isContactNumValid;
  }


  const handleSignInButtonPress = () => {
    if(!isInputsValid()) return;
    setIsLoading(true);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top circular gradient */}
      <LinearGradient
        colors={['#6C9BCF', "#F8F9FA"]}
        style={styles.topGradient}
      />

      <KeyboardAvoidingView
          style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView>
          <Padding horizontal={16} vertical={32}>
            <Column>
              <Text style={styles.titleText}>SignUp with Eterne</Text>
              <Column align="center" style={{ width: "100%" }}>
                <Padding vertical={32}>
                  <Stack>
                    <Logo width={154} height={154} />
                    <Stack.Item
                      left={-50}
                      bottom={30}
                      style={{ borderRadius: 10, overflow: "hidden" }}
                    >
                      <BlurView intensity={20} tint="light">
                        <GradientContainer opacity={0.6}>
                          <Padding all={8}>
                            <Text style={styles.supportingText}>
                              Signup to create an account
                            </Text>
                          </Padding>
                        </GradientContainer>
                      </BlurView>
                    </Stack.Item>
                  </Stack>
                </Padding>
              </Column>

              <GenericTextInput 
                ref={emailRef}
                placeholder="Email"
                validator={AppValidators.email}
                isRequired={true}
                successMessage="Valid email"
              />
              <Spacer height={12} />
              <GenericTextInput 
                ref={usernameRef}
                placeholder="Username" 
                validator={AppValidators.username}
                isRequired={true}
                successMessage="Valid username"
              />
              <Spacer height={12} />
              {/* create a specialized textinput for this */}
              <PhoneInput
                ref={contactNumRef}
              />
              <Spacer height={12} />
              <GenericTextInput 
                ref={passwordRef}
                placeholder="Password" 
                validator={AppValidators.password}
                isRequired={true}
                successMessage="Strong password"
              />
              <Spacer height={12} />
              <GenericTextInput 
                ref={confirmPassRef}
                placeholder="Confirm Password"
                validator={confirmPasswordValidator}
                isRequired={true}
                successMessage="Password matches"
              />
              <Spacer height={4} />

              <Row justify="flex-end" style={{ width: "100%" }}>
                <TouchableHighlight underlayColor={hexToRgba(AppColors.primaryColor, 0.2)} style = {styles.touchableHighlight} onPress={gotoSignIn}>
                  <Text style={styles.alreadyHaveAnAccountText}>
                    Already have an account? Login
                  </Text>
                </TouchableHighlight>
              </Row>

              <Spacer height={12} />
              <PrimaryButton onPress={handleSignInButtonPress} label="Signup" />
              <Spacer height={12} />

              <Row>
                <Expanded>
                  <Divider color={hexToRgba("#023E65", 0.5)} />
                </Expanded>
                <Padding horizontal={16}>
                  <Text style={styles.orText}>OR</Text>
                </Padding>
                <Expanded>
                  <Divider color={hexToRgba("#023E65", 0.5)} />
                </Expanded>
              </Row>

              <Spacer height={12} />
              <PrimaryButton style={{ backgroundColor: "#000000" }}>
                <Row>
                  <FontAwesome name="apple" size={24} color="white" />
                  <Spacer width={8} />
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "500",
                      fontFamily: "SFProText",
                    }}
                  >
                    Signup with Apple
                  </Text>
                </Row>
              </PrimaryButton>

              <Spacer height={12} />
              <OutlineButton style={{ borderColor: hexToRgba("#000000", 0.75) }}>
                <Row>
                  <FontAwesome
                    name="google"
                    size={24}
                    color={hexToRgba("#023E65", 0.5)}
                  />
                  <Spacer width={8} />
                  <Text
                    style={{
                      color: "black",
                      fontWeight: "500",
                      fontFamily: "SFProText",
                    }}
                  >
                    Signup with Google
                  </Text>
                </Row>
              </OutlineButton>
            </Column>
          </Padding>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom circular gradient */}
      <LinearGradient
        colors={["#F8F9FA", "#6C9BCF"]}
        style={styles.bottomGradient}
      />
      {/* Modal */}
      <GenericModal visible = {isLoading} onClose={() => {}}>
        <Column>
          <Padding style = {styles.signUpModalContainer}>
            <Text style = {styles.signUpModalTitleText}>Creating account...</Text>
            <ActivityIndicator size={'large'} color={AppColors.primaryColor}/>
          </Padding>
        </Column>
      </GenericModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
  titleText: {
    fontFamily: "SFProText",
    fontWeight: "700",
    fontSize: 31,
    lineHeight: 34,
    color: AppColors.primaryColor,
  },
  supportingText: {
    fontFamily: "SFProText",
    fontWeight: "700",
    fontSize: 14,
    color: hexToRgba("#023E65", 0.6),
  },
  alreadyHaveAnAccountText: {
    fontFamily: "SFProText",
    fontSize: 14,
    fontWeight: "500",
    color: AppColors.secondaryColor,
  },
  orText: {
    fontFamily: "SFProText",
    fontSize: 11,
    fontWeight: "400",
    color: hexToRgba("#023E65", 0.6),
  },
  signUpModalContainer : {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  signUpModalTitleText : {
    fontSize: 20,              // Larger than body text
    fontWeight: '700',         // Bold for emphasis
    color: '#023E65',          // Primary or brand color
    textAlign: 'center',       // Centered in the modal
    marginBottom: 12,          // Space below before content
    fontFamily: 'SFProText',   // Keep consistent with your app typography
  },
  touchableHighlight: {
    paddingHorizontal: 8,
    borderRadius: 8
  }

});