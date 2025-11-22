import { Text, StyleSheet, ScrollView, TouchableHighlight } from "react-native";
import { Column, Expanded, Padding, Row, Spacer, Stack } from "@/components/layout/layout";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../assets/svg/llm_logo.svg";
import AppColors from "@/core/styling/AppColors";
import GenericContainer from "@/components/containers/genericContainer";
import { BlurView } from "expo-blur";
import { hexToRgba } from "@/core/utils/colorHelpers";
import GenericTextInput from "@/components/textinputs/genericTextInput";
import PrimaryButton from "@/components/buttons/primaryButton";
import Divider from "@/components/spacer/divider";
import { FontAwesome } from "@expo/vector-icons";
import OutlineButton from "@/components/buttons/outlinedButton";
import { LinearGradient } from "expo-linear-gradient";

export default function SignInScreen() {
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
        <Padding horizontal={16} vertical={32}>
          <Column>
            <Text style={styles.titleText}>Login with Eterne</Text>
            <Column align="center" style={{ width: "100%" }}>
              <Padding vertical={32}>
                <Stack>
                  <Logo width={154} height={154} />
                  <Stack.Item
                    left={-50}
                    bottom={30}
                    style={{ borderRadius: 10, overflow: "hidden" }}
                  >
                    <BlurView intensity={50} tint="light">
                      <GenericContainer opacity={0.2}>
                        <Padding all={8}>
                          <Text style={styles.supportingText}>
                            Signup to create an account
                          </Text>
                        </Padding>
                      </GenericContainer>
                    </BlurView>
                  </Stack.Item>
                </Stack>
              </Padding>
            </Column>

            <GenericTextInput placeholder="Email" />
            <Spacer height={12} />
            <GenericTextInput placeholder="Password" />
            <Spacer height={12} />

            <Spacer height={12} />
            <PrimaryButton label="Signup" />
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
            <Expanded>
              <Column
                justify="flex-end"
                style = {{
                  flex: 1
                }}
              >
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
            </Expanded>
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
});