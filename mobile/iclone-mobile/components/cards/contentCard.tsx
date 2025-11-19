import { View, StyleSheet, Text } from "react-native";
import FrostedCard from "./frostedCard";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { Padding, Row } from "../layout/layout";
import { hexToRgba } from "@/core/utils/colorHelpers";
import AppColors from "@/core/styling/AppColors";

export default function ContentCard () {
  return (
    <FrostedCard>
      <Padding all={16} style = {styles.mainContainer}>
        {/* HEADER */}
        <Row justify="space-between" >
          <Row>
            <Ionicons name="image-outline"/>
            <Text>Gallery</Text>
          </Row>
          <SimpleLineIcons name="options"/>
        </Row>
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
  }
})