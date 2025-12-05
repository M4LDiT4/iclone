import { LinearGradient } from "expo-linear-gradient";
import { memo, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import GlobalStyles from "@/core/styling/GlobalStyles";
import AppColors from "@/core/styling/AppColors";
import LogoWithFloatingText from "@/components/logo/logoWithFloatingText";
import CrossPlatformDatePicker, { DatePickerHandle } from "@/components/pickers/crossPlatformDatePicker";
import { Spacer } from "@/components/layout/layout";
import { Ionicons } from "@expo/vector-icons";
import { useOnboardingContext } from "@/core/contexts/onboardingContext";
import { useRouter } from "expo-router";
import { AppValidators } from "@/core/utils/appValidators";
import { capitalizeWords } from "@/core/utils/formatter";

function SetBirthDateScreen (){
  const {birthdate, name, setBirthDate} = useOnboardingContext();
  const router = useRouter();
  const datePickerRef = useRef<DatePickerHandle>(null);

  useEffect(() => {
    if(birthdate){
      datePickerRef.current?.setValue(birthdate);
    }
  }, [])

  const onPress = () => {
    if(datePickerRef.current?.validate()){
      setBirthDate(datePickerRef.current.getValue()!);
      router.push("/onboarding/healthStatus");
    }
  }

  return <SafeAreaView style = {styles.safeArea}>
    <LinearGradient
      colors={["#6C9BCF", "#F8F9FA"]}
      style={GlobalStyles.screenGradientTop}
    />
    <LogoWithFloatingText text={`Hi ${capitalizeWords(name)}! Nice meeting you! May I know your birth date?`} width={252}/>
    <Spacer height={60}/>
    <View style = {styles.actionButtonContainer}>
      <CrossPlatformDatePicker 
        buttonStyle={styles.datePickerButtonStyle} 
        isFlex={true} textStyle={styles.datePickerButtonTextStyle}
        validator={AppValidators.nonEmptyDate}
        ref = {datePickerRef}
      />
      <TouchableOpacity style={styles.sendButton} onPress={onPress}>
        <Ionicons name="send" size={20} color={AppColors.primaryColor} />
      </TouchableOpacity>
    </View>
    <LinearGradient
      colors={["#F8F9FA", "#6C9BCF"]}
      style={GlobalStyles.screenGradientBottom}
    />
  </SafeAreaView>
};

export default memo(SetBirthDateScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: AppColors.backgroundColor,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionButtonContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    backgroundColor: AppColors.backgroundColor,
    paddingHorizontal: 16,
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
  datePickerButtonStyle: {
    backgroundColor: 'transparent',
    height: 47,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  datePickerButtonTextStyle: {
    fontFamily: "SFProText",
    fontSize: 14,
    color: 'rgba(2, 62, 101, 0.6)',
    fontWeight: 'bold',
  }
})