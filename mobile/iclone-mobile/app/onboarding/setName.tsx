import { memo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

function setNameScreen () {
  return (
    <SafeAreaView style = {styles.safeArea}>

    </SafeAreaView>
  )
}

export default memo(setNameScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'green'
  }
})

