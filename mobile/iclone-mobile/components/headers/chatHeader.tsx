import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import AppColors from "@/core/styling/AppColors";

type HeaderProps = {
  label: string; // required prop
  onBackPress: () => void;
};

export default function ChatHeader({ label, onBackPress }: HeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress}>
        <Feather
          name="arrow-left-circle"
          size={36}
          color={AppColors.secondaryColor}
        />
      </TouchableOpacity>

      <Text style={styles.labelText}>{label}</Text>

      <MaterialIcons
        name="more-vert"
        size={28}
        color={AppColors.secondaryColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  labelText: {
    fontFamily: "SFProText",
    fontWeight: "bold",
    fontSize: 31,
    lineHeight: 31,
    color: AppColors.primaryColor,
  },
});