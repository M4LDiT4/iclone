import { memo, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import GradientContainer from "../containers/gradientContainer";
import { AntDesign } from "@expo/vector-icons";
import AppColors from "@/core/styling/AppColors";
import { LinearGradient } from "expo-linear-gradient";
import { Spacer } from "../layout/layout";
import ComponentStatus from "@/core/types/componentStatusType";

function MemoryCard(){
  // get context for the memory service
  const [componentStatus, setComponentStatus] = useState<ComponentStatus>('idle');

  useEffect(() =>{

  });
  return <View style = {styles.container}>
      <LinearGradient
        colors={["#FFFFFF", 'rgba(186, 224, 243, 1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
      <GradientContainer width={82} height={76} borderRadius={10}>
      <View style = {styles.contentContainer}>
        <AntDesign size={24} color={AppColors.primaryColor} name = "message"/>
        <Spacer height={4}/>
        <Text 
          style = {styles.contentText}
          ellipsizeMode="tail"
          numberOfLines={3}
        >
          Advice for important life moments 
        </Text>
      </View>
    </GradientContainer>
  </View>
}

export default memo(MemoryCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 1,
    borderRadius: 12,
    overflow: 'hidden'
  },
  contentContainer: {
    padding: 8,
    flex: 1,
  },
  contentText : {
    fontWeight: "bold",
    fontSize: 8,
    fontFamily: "SFProText",
    color: AppColors.primaryColor,
  }
});