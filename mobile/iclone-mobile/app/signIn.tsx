import { Text, StyleSheet, ScrollView, TouchableHighlight } from "react-native";
import {Checkbox} from 'expo-checkbox';
import { Center, Column, Expanded, Padding, Row, Spacer, Stack } from "@/components/layout/layout";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../assets/svg/llm_logo.svg";
import AppColors from "@/core/styling/AppColors";
import { BlurView } from "expo-blur";
import { hexToRgba } from "@/core/utils/colorHelpers";
import GenericTextInput from "@/components/textinputs/genericTextInput";
import PrimaryButton from "@/components/buttons/primaryButton";
import Divider from "@/components/spacer/divider";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import OutlineButton from "@/components/buttons/outlinedButton";
import { LinearGradient } from "expo-linear-gradient";
import GradientContainer from "@/components/containers/gradientContainer";
import { useRouter } from "expo-router";

export default function SignInScreen() {
  const router = useRouter();

  const gotoSignUp = () => {
    router.replace('/signUp');
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top circular gradient */}
      <LinearGradient
        colors={['#6C9BCF', "#F8F9FA"]}
        style={styles.topGradient}
      />

      <ScrollView
        style= {styles.scrollViewContentContainer}
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
            <GenericTextInput placeholder="Email" />
            <Spacer height={12} />
            <GenericTextInput placeholder="Password" />
            <Spacer height={12} />

            {/* CHECKBOX + FORGET PASSWORD */}
            <Row justify="space-between" style={{width: '100%'}}>
              <Row>
                <Checkbox/>
                <Spacer width={8}/>
                <Text style = {styles.rememberMe}>Remember me</Text>
              </Row>
              <TouchableHighlight>
                <Text style = {styles.forgotPassword}>Forgot Password?</Text>
              </TouchableHighlight>
            </Row>

            {/* LOGIN BUTTON */}
            <Spacer height={12} />
            <PrimaryButton label="Login" />
            <Spacer height={12} />
            {/* CREATE ACCOUNT TEXT BUTTON */}
            <Center>
              <TouchableHighlight onPress={gotoSignUp}>
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
                    Login with Apple
                  </Text>
                </Row>
              </PrimaryButton>

              <Spacer height={12} />
              {/* LOGIN WITH GOOGLE */}
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
  }
});