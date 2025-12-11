import { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import GradientContainer from "../containers/gradientContainer";

function MemoryCard(){
  return <GradientContainer width={82} height={76}>
    <Text>
      Memory Card
    </Text>
  </GradientContainer>
}

export default memo(MemoryCard);

const styles = StyleSheet.create({
  container: {
    padding: 12,
    width: 82,
    height: 76
  }
});