import ChatModel from "@/data/database/models/chatModel";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import Logo from "../../assets/svg/llm_logo.svg";
import { memo } from "react";
import MemoryCard from "../memoryList/memoryCard";

interface HomeLogoProps {
  memories: ChatModel[]
  gotoMemoryList: () => void,
}

function HomeLogo(props: HomeLogoProps){
  return <TouchableOpacity 
      onPress={props.gotoMemoryList} 
      style={styles.svgContainer}
    >
      <View>
        <Logo />
        {
          props.memories.map((item, index) => 
            <View key={index} style = {overlayPositions[index]}>
              <MemoryCard chat={item}/>
            </View>
          ) 
        }
      </View>
    </TouchableOpacity>
}

export default memo(HomeLogo);

const styles = StyleSheet.create({
  svgContainer: {
    paddingVertical: 32,
  },
  logoWrapper: {
    position: "relative", // allows absolute children
    justifyContent: "center",
    alignItems: "center",
  },

});

const overlayPositions: ViewStyle[] = [
  { position: "absolute", top: 3 , left: -10 },       // top-left
  { position: "absolute", top: 60, right: -20 },      // top-right
  { position: "absolute", bottom: 10, left: -30 },    // bottom-left
  { position: "absolute", bottom: -30, right: 0 },   // bottom-right
];
