import GlobalStyles from "@/core/styling/GlobalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useRef, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import AppColors from "@/core/styling/AppColors";
import LogoWithFloatingText from "@/components/logo/logoWithFloatingText";
import { Spacer } from "@/components/layout/layout";
import GradientButton from "@/components/buttons/gradientButton";
import GenericTextInput, { GenericTextInputHandle } from "@/components/textinputs/genericTextInput";
import { Ionicons } from "@expo/vector-icons";
import { AppValidators } from "@/core/utils/appValidators";

function ShareDecisionScreen(){
  const [showTextInput, setShowTextInput] = useState(false);
  const textRef = useRef<GenericTextInputHandle>(null);

  const handleYes = () => {
    setShowTextInput(true);
  }

  const onSend = () => {

  }

  return <SafeAreaView style = {styles.safeArea}>
    <LinearGradient
      colors={["#6C9BCF", "#F8F9FA"]}
      style={GlobalStyles.screenGradientTop}
    />
    <KeyboardAvoidingView
      style = {{flex: 1}}
      behavior={Platform.OS === 'ios' ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle = {{flexGrow: 1, justifyContent: 'center', alignItems: 'center', flex:1 }}
        keyboardShouldPersistTaps = "handled"
        showsVerticalScrollIndicator = {false}
      >
        <LogoWithFloatingText width={249} text="Can you share about it?"/>

        <Spacer height={50}/>
        { showTextInput
        ?<View style={styles.textinputContainer}>
          <View style={{ flex: 1 }}>
            <GenericTextInput containerStyle={styles.textinput} ref={textRef} validator={AppValidators.nonEmpty}/>
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={onSend}>
            <Ionicons name="send" size={20} color={AppColors.primaryColor} />
          </TouchableOpacity>
        </View>
        :<>
          <GradientButton onPress={handleYes} label="Yes" state="success"/>
          <Spacer height={16}/>
          <GradientButton label="No" state="error"/>
        </>
      }

      </ScrollView>
    </KeyboardAvoidingView>
    <LinearGradient
      colors={["#F8F9FA", "#6C9BCF"]}
      style={GlobalStyles.screenGradientBottom}
    />
  </SafeAreaView>
}

export default memo(ShareDecisionScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.backgroundColor,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
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