import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AppColors from "@/core/styling/AppColors";

const TypingIndicator = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Eterne is typing...</Text>
    </View>
  );
};

export default TypingIndicator;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: AppColors.secondaryColor,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginVertical: 4,
  },
  text: {
    fontSize: 14,
    fontStyle: "italic",
    color: AppColors.primaryColor,
    fontFamily: "SFProText",
  },
});