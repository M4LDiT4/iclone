import { memo } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import GenericContainer from "../containers/genericContainer";
import { Entypo, Ionicons } from "@expo/vector-icons";
import AppColors from "@/core/styling/AppColors";
import MemoryCard from "./memoryCard";


function MemoryContainer(){
  return <GenericContainer borderRadius={10}>
    <View style = {styles.contentContainer}>
      <View style = {styles.header}>
        {/* generate icon here */}
        <Ionicons size={24} name = "images-outline" color={AppColors.primaryColor}/>
        <Text style = {styles.headerText}>Gallery</Text>
        <Entypo size={24} name="dots-three-horizontal" color={AppColors.primaryColor}/>
      </View>
      <ScrollView horizontal>
        <MemoryCard/>
      </ScrollView>
    </View>
  </GenericContainer>
}

export default memo(MemoryContainer)

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 16
  },
  headerText: {
    flex: 1,
    marginHorizontal: 18,
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: "SFProText",
    color: AppColors.primaryColor,
  }
});