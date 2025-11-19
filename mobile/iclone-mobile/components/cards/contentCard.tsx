import { View, StyleSheet, Text, ScrollView } from "react-native";
import FrostedCard from "./frostedCard";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { Column, Padding, Row, Spacer } from "../layout/layout";
import AppColors from "@/core/styling/AppColors";
import { LinearGradient } from "expo-linear-gradient";
import { hexToRgba } from "@/core/utils/colorHelpers";

export default function ContentCard () {
  // TODO: accept label, and children
  // optional: accept icon, otherwise provide a neutral icon for this
  return (
    <LinearGradient
      colors={['#EDF2FB', hexToRgba(AppColors.secondaryColor, 0.5)]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style ={{padding: 2, borderRadius: 10}}
    >
    <LinearGradient
        colors={[hexToRgba('#EDF2FB', 0.8), hexToRgba(AppColors.secondaryColor, 0.5)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style = {styles.container}
      >
        <Padding all={16} style = {styles.contentContainer}>
          {/* HEADER */}
          <Column>
            <Padding style ={{width: '100%'}} bottom={8}>
              <Row justify="space-between" >
                <Row>
                  <Ionicons name="image-outline" color={AppColors.primaryColor} size={24}/>
                  <Spacer width={8}/>
                  <Text
                    style = {styles.labelText}
                  >
                    Gallery
                  </Text>
                </Row>
                  <SimpleLineIcons color={AppColors.primaryColor} size={24} name="options"/>
              </Row>
            </Padding>
            <ScrollView horizontal>
              <FrostedCard>
                <View style = {{width: 100, height: 100}}>

                </View>
              </FrostedCard>
            </ScrollView>
          </Column>
        </Padding>
      </LinearGradient>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container:{
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  contentContainer: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden'
  },
  labelText : {
    fontFamily: 'SFProText',
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 14,
    color: AppColors.primaryColor
  }
})