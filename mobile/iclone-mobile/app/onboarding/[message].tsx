import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GlobalStyles from "@/core/styling/GlobalStyles";
import { memo, useState } from "react";
import AppColors from "@/core/styling/AppColors";
import LogoWithFloatingText from "@/components/logo/logoWithFloatingText";
import { Column, Padding, Spacer } from "@/components/layout/layout";
import PrimaryButton from "@/components/buttons/primaryButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOnboardingContext } from "@/core/contexts/onboardingContext";
import GenericModal from "@/components/modals/genericModal";
import AuthService from "@/services/AuthService";
import { AuthServiceError } from "@/core/errors/AuthServiceError";

function OnboardingFinishScreen(){
  const {message} = useLocalSearchParams<{message: string}>();
  const {name, birthdate, illness} = useOnboardingContext();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>();

  const handleCloseErrorMessage = () => {
    setError(null);
  }

  const handleFinishOnboarding = async() =>{
    try{
      setIsLoading(true);
      await AuthService.updateUserProfile({
        name: name,
        birthdate: birthdate!,
        illness: illness
      });
      router.dismissAll();
      router.push("/home");
    }catch(err){
      console.error(`Error in onboarding: ${err}`);
      if(err instanceof AuthServiceError){
        setError(err.message)
      }else{
        setError("Unexpected error occured while finishing onboarding")
      }
    }finally{
      setIsLoading(false);
    }
  }
  return <SafeAreaView style = {styles.safeAreaView}>
    <LinearGradient
      colors={["#6C9BCF", "#F8F9FA"]}
      style={GlobalStyles.screenGradientTop}
    />
    <LogoWithFloatingText width={249} text={message} />
    <Spacer height={75}/>
    <PrimaryButton onPress={handleFinishOnboarding} label="Finish onboarding"/>
    <LinearGradient
      colors={["#F8F9FA", "#6C9BCF"]}
      style={GlobalStyles.screenGradientBottom}
    />
    <GenericModal visible = {!isLoading && error != null} onClose={() => {}}>
      <Column>
        <Padding style = {styles.signUpModalContainer}>
          <Text style = {styles.signUpModalTitleText}>{error}</Text>
          <Spacer height={8}/>
          <PrimaryButton label="Okay" onPress={handleCloseErrorMessage}/>
        </Padding>
      </Column>
    </GenericModal>
    <GenericModal visible = {isLoading} onClose={() => {}}>
        <Column>
          <Padding style = {styles.signUpModalContainer}>
            <Text style = {styles.signUpModalTitleText}>Wrapping up onboarding...</Text>
            <ActivityIndicator size={'large'} color={AppColors.primaryColor}/>
          </Padding>
        </Column>
      </GenericModal>
  </SafeAreaView>
}

export default memo(OnboardingFinishScreen)

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: AppColors.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
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
})