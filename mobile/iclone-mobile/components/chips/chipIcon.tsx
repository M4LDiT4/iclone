import AppColors from "@/core/styling/AppColors";
import { BlurView } from "expo-blur";
import { View, Text, StyleSheet } from "react-native";
import { JSX } from "react/jsx-runtime";
import FrostedCard from "../cards/frostedCard";
import { hexToRgba } from "@/core/utils/colorHelpers";
import Spacer from "../spacers/spacer";

type chipIconProps = {
  icon: JSX.Element,
  label: string
}

export default function ChipIcon(props: chipIconProps){
  return (
    <FrostedCard
      tintColor={hexToRgba(AppColors.secondaryColor, 0.1)}
    >
      <View style = {styles.mainContainer}>
        {props.icon}
        <Spacer
          width={8}
        />
        <Text
          style={styles.labelText}
        >
          {props.label}
        </Text>
      </View>
    </FrostedCard>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  labelText: {
    fontWeight: 700,
    fontSize: 13,
    fontFamily: 'SFProText',
    color: AppColors.primaryColor
  }
});
