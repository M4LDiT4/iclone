import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../assets/svg/llm_logo.svg";
import { memo } from "react";
import { StyleSheet } from "react-native";

function LoadingScreen(){
  return (
    <SafeAreaView style = {styles.safeAreaView}>
      <Logo/>
    </SafeAreaView>
  )
}

export default memo(LoadingScreen);

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
