import { Text, StyleSheet, ScrollView, TouchableHighlight, ActivityIndicator } from "react-native";
import {Checkbox} from 'expo-checkbox';
import { Center, Column, Expanded, Padding, Row, Spacer, Stack } from "@/components/layout/layout";
import { SafeAreaView } from "react-native-safe-area-context";
import AppColors from "@/core/styling/AppColors";
import { BlurView } from "expo-blur";
import { hexToRgba } from "@/core/utils/colorHelpers";
import GenericTextInput, { GenericTextInputHandle } from "@/components/textinputs/genericTextInput";
import PrimaryButton from "@/components/buttons/primaryButton";
import Divider from "@/components/spacer/divider";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import OutlineButton from "@/components/buttons/outlinedButton";
import { LinearGradient } from "expo-linear-gradient";
import GradientContainer from "@/components/containers/gradientContainer";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import GenericModal from "@/components/modals/genericModal";
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthService from "@/services/AuthService";
import { AppValidators } from "@/core/utils/appValidators";
import { AuthServiceError } from "@/core/errors/AuthServiceError";
import { ValidationError } from "@/core/errors/ValidationError";

import Logo from "../../assets/svg/llm_logo.svg";

export default function SignInScreen() {
  const router = useRouter();

  const emailRef = useRef<GenericTextInputHandle>(null);
  const passwordRef = useRef<GenericTextInputHandle>(null);
  // states
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState<string|null>(null);


  const handleSignInButtonPress = async () => {
    setIsLoading(true);
    const email = emailRef.current?.getValue();
    const password = passwordRef.current?.getValue();

    if(!email || !password) return;
    await AuthService.signInWithEmail(email, password)
      .then( async() => {
        if(rememberMe){
          await AsyncStorage.setItem("rememberMe", "true");
          await AsyncStorage.setItem("rememberedEmail", email);
        }
      })
      .catch((err) => console.log(err))

    setIsLoading(false);
  }

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  }

  const handleCloseErrorMessage = () => {
    setErrMessage(null);
  }

  const handleSigninWithGoogle = async () => {
    try{
      setIsLoading(true);
      const credential = await AuthService.authWithGoogle();
      if(credential.additionalUserInfo?.isNewUser){
        router.replace("/onboarding/setName");
      }
    }catch(err){
      if(err instanceof AuthServiceError){
        setErrMessage(err.message);
      }else if(err instanceof ValidationError){
        setErrMessage(err.message);
      }else{
        setErrMessage("Unexpected error occured while signing-in ")
      }
    }finally{
      setIsLoading(false);
    }
  }

  const gotoSignUp = () => {
    router.replace('/authentication/signUp');
  }

  useEffect(() => {
    const loadRememberMe = async () => {
      try{
        const value = await AsyncStorage.getItem("rememberMe");
        if(value === 'true'){
          setRememberMe(true); 
          const emailValue = await AsyncStorage.getItem("rememberedEmail");
          if(emailValue){
            emailRef.current?.setValue(emailValue);
          }
        }
      }catch(err){
        console.log("Failed to load remember me flag")
      }
    }
    loadRememberMe();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top circular gradient */}
      <LinearGradient
        colors={['#6C9BCF', "#F8F9FA"]}
        style={styles.topGradient}
      />

      <ScrollView
        style= {styles.scrollViewContentContainer}
        keyboardShouldPersistTaps = "always"
      >
        {/* CONTENT PADDING */}
        <Padding horizontal={16} vertical={32}>
          {/* CONTENT COLUMN */}
          <Column>
            {/* TITLE TEXT */}
            <Text style={styles.titleText}>Login with Eterne</Text>
            {/* HERO */}
            <Column align="center" style={{ width: "100%" }}>
              <Padding vertical={32}>
                <Stack>
                  <Logo width={154} height={154} />
                  <Stack.Item
                    right={-50}
                    top={20}
                    style={{ borderRadius: 10, overflow: "hidden" }}
                  >
                    <BlurView intensity={20} tint="light">
                      <GradientContainer width={124} opacity={0.6}>
                        <Padding all={8}>
                          <Text style={styles.supportingText}>
                            You can login using your biometrics
                          </Text>
                        </Padding>
                      </GradientContainer>
                    </BlurView>
                  </Stack.Item>
                  <Stack.Item
                    left={-50}
                    bottom={40}
                    style={{ borderRadius: 10, overflow: "hidden" }}
                  >
                    <BlurView intensity={20} tint="light">
                      <GradientContainer opacity={0.6}>
                        <Padding all={8}>
                          <FontAwesome5 size={68} name = "fingerprint" color = {hexToRgba("#023E65", 0.8)}/>
                        </Padding>
                      </GradientContainer>
                    </BlurView>
                  </Stack.Item>
                </Stack>
              </Padding>
            </Column>

            {/* TEXT INPUTS */}
            <GenericTextInput placeholder="Email" ref={emailRef} validator={AppValidators.nonEmpty}/>
            <Spacer height={12} />
            <GenericTextInput placeholder="Password" validator={AppValidators.nonEmpty} isSensitive = {true} ref = {passwordRef}/>
            <Spacer height={12} />

            {/* CHECKBOX + FORGET PASSWORD */}
            <Row justify="space-between" style={{width: '100%'}}>
              <Row>
                <Checkbox onValueChange={toggleRememberMe} color={rememberMe ? AppColors.primaryColor : undefined} value = {rememberMe}/>
                <Spacer width={8}/>
                <Text style = {styles.rememberMe}>Remember me</Text>
              </Row>
              <TouchableHighlight style ={styles.touchableHighlight} underlayColor={hexToRgba(AppColors.primaryColor, 0.2)}>
                <Text style = {styles.forgotPassword}>Forgot Password?</Text>
              </TouchableHighlight>
            </Row>

            {/* LOGIN BUTTON */}
            <Spacer height={12} />
            <PrimaryButton style={{width: '100%'}} label="Login" onPress={handleSignInButtonPress}/>
            <Spacer height={12} />
            {/* CREATE ACCOUNT TEXT BUTTON */}
            <Center>
              <TouchableHighlight style ={styles.touchableHighlight} underlayColor={hexToRgba(AppColors.primaryColor, 0.2)} onPress={gotoSignUp}>
                <Text style={styles.forgotPassword}>Create account</Text>
              </TouchableHighlight>
            </Center>
            {/* OR DIVIDER */}
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
            {/* LOG IN WITH APPLE */}
            <PrimaryButton style={{ backgroundColor: "#000000", width: '100%' }}>
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
                    Login with Apple
                  </Text>
                </Row>
              </PrimaryButton>

              <Spacer height={12} />
              {/* LOGIN WITH GOOGLE */}
              <OutlineButton style={{ borderColor: hexToRgba("#000000", 0.75), width: '100%'}} onPress={handleSigninWithGoogle}>
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
                    Login with Google
                  </Text>
                </Row>
              </OutlineButton>
          </Column>
        </Padding>
      </ScrollView>

      {/* Bottom circular gradient */}
      <LinearGradient
        colors={["#F8F9FA", "#6C9BCF"]}
        style={styles.bottomGradient}
      />
      {/* Modal */}
      <GenericModal visible = {isLoading} onClose={() => {}}>
        <Column>
          <Padding style = {styles.signUpModalContainer}>
            <Text style = {styles.signUpModalTitleText}>Signing in...</Text>
            <ActivityIndicator size={'large'} color={AppColors.primaryColor}/>
          </Padding>
        </Column>
      </GenericModal>
      <GenericModal visible = {!isLoading && errMessage != null} onClose={() => {}}>
        <Column>
          <Padding style = {styles.signUpModalContainer}>
            <Text style = {styles.signUpModalTitleText}>{errMessage}</Text>
            <Spacer height={8}/>
            <PrimaryButton label="Okay" onPress={handleCloseErrorMessage}/>
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
  scrollViewContentContainer: {
    flexGrow: 1,
    flex: 1,
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
  forgotPassword: {
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
  rememberMe : {
    fontFamily: "SFProText",
    fontWeight: "medium",
    fontSize: 14,
    color: hexToRgba("#023E65", 0.6)
  },
  touchableHighlight: {
    paddingHorizontal: 8,
    borderRadius: 8
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
});