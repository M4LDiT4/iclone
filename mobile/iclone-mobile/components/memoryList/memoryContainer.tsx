import { memo } from "react";
import { StyleSheet, View } from "react-native";
import GenericContainer from "../containers/genericContainer";

type Props = {
  children: React.ReactNode; // declare children type
};

function MemoryContainer({ children }: Props){
  return <GenericContainer borderRadius={10}>
    <View style = {styles.contentContainer}>
      {children}
    </View>
  </GenericContainer>
}

export default memo(MemoryContainer)

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
    padding: 8
  }
});