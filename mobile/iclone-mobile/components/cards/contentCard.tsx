import { View, StyleSheet, Text, ScrollView } from "react-native";
import FrostedCard from "./frostedCard";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { Column, Padding, Row, Spacer } from "../layout/layout";
import { hexToRgba } from "@/core/utils/colorHelpers";
import AppColors from "@/core/styling/AppColors";

export default function ContentCard () {
  // TODO: accept label, and children
  // optional: accept icon, otherwise provide a neutral icon for this
  return (
    <FrostedCard>
      <Padding all={16} style = {styles.mainContainer}>
        {/* HEADER */}
        <Column>
          <Padding style ={{width: '100%'}} vertical={8}>
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
    </FrostedCard>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    backgroundColor: hexToRgba(AppColors.secondaryColor, 0.2),
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