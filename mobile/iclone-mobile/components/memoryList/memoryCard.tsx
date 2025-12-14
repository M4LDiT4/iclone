import { memo} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import GradientContainer from "../containers/gradientContainer";
import AppColors from "@/core/styling/AppColors";
import { LinearGradient } from "expo-linear-gradient";
import { Spacer } from "../layout/layout";
import IconRenderer from "../icons/iconRenderer";
import ChatModel from "@/data/database/models/chatModel";
import { useRouter } from "expo-router";

interface MemoryCardProps {
  chat: ChatModel
}

function MemoryCard(props : MemoryCardProps){
  const router = useRouter();

  const gotoConfirmChatScreen = () => {
    router.push({
      pathname: '/chat/confirmMemory',
      params: {
        chatId: props.chat.id
      }
    });
  }
  return (
    <TouchableOpacity onPress={gotoConfirmChatScreen}>
      <View style = {styles.container}>
        <LinearGradient
          colors={["#FFFFFF", 'rgba(186, 224, 243, 1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
        <GradientContainer width={82} height={76} borderRadius={10}>
          <View style = {styles.contentContainer}> 
            <IconRenderer
              library={props.chat.iconLibrary ?? ""}
              name={props.chat.iconName ?? ""}
              size={24}
            />
            <Spacer height={4}/>
            <Text 
              style = {styles.contentText}
              ellipsizeMode="tail"
              numberOfLines={3}
            >
              {props.chat.title}
            </Text>
          </View>
        </GradientContainer>
      </View>
    </TouchableOpacity>
  )
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