import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, View, Text } from "react-native";
import AppColors from "@/core/styling/AppColors";
import { Feather, SimpleLineIcons } from "@expo/vector-icons";

export default function ChatHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{...styles.container, height: 70 +insets.top, paddingTop: insets.top}}>
      <View style = {styles.contentContainer}>
        <Feather name="arrow-left-circle" size={36} color={AppColors.secondaryColor}/>
        <Text style ={styles.converseText}>Converse</Text>
        <SimpleLineIcons name='options' size={36} color={AppColors.secondaryColor}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.primaryColor,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.backgroundColor,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  converseText : {
    fontFamily: 'SFProText',
    fontWeight: 'bold',
    fontSize: 31,
    lineHeight: 31,
    color: AppColors.primaryColor
  }
});