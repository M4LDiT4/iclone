import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import GlobalStyles from "@/core/styling/GlobalStyles";
import AppColors from "@/core/styling/AppColors";
import LogoWithFloatingText from "@/components/logo/logoWithFloatingText";
import CrossPlatformDatePicker from "@/components/pickers/crossPlatformDatePicker";
import { Spacer } from "@/components/layout/layout";
import { Ionicons } from "@expo/vector-icons";

function SetBirthDateScreen (){

  const onPress = () => {}

  return <SafeAreaView style = {styles.safeArea}>
    <LinearGradient
      colors={["#6C9BCF", "#F8F9FA"]}
      style={GlobalStyles.screenGradientTop}
    />
    <LogoWithFloatingText text="Hi Elena! Nice meeting you! May I know your birth date?" width={252}/>
    <Spacer height={60}/>
    <LinearGradient
      colors={[
        "rgba(237, 242, 251, 0.5)", // light bluish
        "rgba(80, 171, 231, 0.5)",  // primary blue
      ]}
      start={{ x: 0, y: 0.5 }}   // left center
      end={{ x: 1, y: 0.5 }}
      style ={styles.actionButtonContainer}
     >
      <CrossPlatformDatePicker buttonStyle={styles.datePickerButtonStyle} isFlex={true} textStyle={styles.datePickerButtonTextStyle}/>
      <TouchableOpacity style={styles.sendButton} onPress={onPress}>
        <Ionicons name="send" size={20} color={AppColors.primaryColor} />
      </TouchableOpacity>
    </LinearGradient>
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
    flexDirection: 'row',
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden'
  },
  sendButton: {
    height: 47,
    width: 47,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  datePickerButtonStyle: {
    backgroundColor: 'transparent',
    height: 47,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  datePickerButtonTextStyle: {
    fontFamily: "SFProText",
    fontSize: 14,
    color: 'rgba(2, 62, 101, 0.6)',
    fontWeight: 'bold',
  }
})