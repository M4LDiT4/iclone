import { Text, StyleSheet } from "react-native";
import { Column, Padding, Row, Stack } from "@/components/layout/layout";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from '../assets/svg/llm_logo.svg';
import AppColors from "@/core/styling/AppColors";
import GenericContainer from "@/components/containers/genericContainer";
import { BlurView } from "expo-blur";

export default function SignUpScreen() {
  return <SafeAreaView style = {styles.safeArea}>
    <Padding horizontal={16}>
      <Column>
        <Text style = {styles.titleText}>SignUp with Eterne</Text>
        <Column align="center" style ={{width: '100%'}}>
          <Padding top={32}>
            <Stack>
              <Logo width={154} height={154}/>
              <Stack.Item left={-50} bottom={30} style ={{borderRadius: 10, overflow: 'hidden'}}>
                <BlurView intensity={50} tint="light">
                  <GenericContainer opacity={0.2}>
                    <Padding all={8}>
                      <Text>Signup to create an account</Text>
                    </Padding>
                  </GenericContainer>
                </BlurView>
              </Stack.Item>
            </Stack>
          </Padding>
        </Column>
      </Column>
    </Padding>
  </SafeAreaView>
}

const styles = StyleSheet.create({
  safeArea : {
    flex: 1,
    backgroundColor: AppColors.backgroundColor,
  },
  titleText : {
    fontFamily: 'SFProText',
    fontWeight: 700,
    fontSize: 31,
    lineHeight: 31,
    color: AppColors.primaryColor,
  },

})