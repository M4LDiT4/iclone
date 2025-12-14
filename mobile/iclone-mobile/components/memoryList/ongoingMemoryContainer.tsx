import { memo, useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import GenericContainer from "../containers/genericContainer";
import { Entypo } from "@expo/vector-icons";
import AppColors from "@/core/styling/AppColors";
import { MemoryService } from "@/services/MemoryService";
import ChatModel from "@/data/database/models/chatModel";
import ComponentStatus from "@/core/types/componentStatusType";
import { ActivityIndicator } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import GradientContainer from "../containers/gradientContainer";
import { Spacer } from "../layout/layout";
import { useRouter } from "expo-router";
import { useAuth } from "@/core/contexts/authContext";

interface MemoryCardProps {
  chat: ChatModel;
}

function MemoryCard({ chat }: MemoryCardProps) {
  const dateObj = new Date(chat.updatedAt);
  const router = useRouter();
  const auth = useAuth();

  const weekday = dateObj.toLocaleDateString(undefined, { weekday: "short" }); // Fri, Mon
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }); // Dec 13, 2025
  const formattedTime = dateObj.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }); // 06:25 PM

  const gotoChatScreen = () =>{
    router.push({
        pathname: `/chat/[chatId]`,
        params: {
          chatId: chat.id,
          username: auth?.profile?.username
        }
      });
  }
  return (
    <TouchableOpacity onPress={gotoChatScreen}>
      <View style={memoryCardStyles.container}>
        <LinearGradient
          colors={["#FFFFFF", "rgba(186, 224, 243, 1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
        <GradientContainer width={82} height={76} borderRadius={10}>
          <View style={memoryCardStyles.contentContainer}>
            {/* Weekday replaces icon */}
            <Text style={memoryCardStyles.weekdayText}>{weekday}</Text>
            <Spacer height={4} />
            {/* Date */}
            <Text style={memoryCardStyles.dateText}>{formattedDate}</Text>
            {/* Time */}
            <Text style={memoryCardStyles.timeText}>{formattedTime}</Text>
          </View>
        </GradientContainer>
      </View>
    </TouchableOpacity>
  );
}

const memoryCardStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  contentContainer: {
    padding: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  weekdayText: {
    fontWeight: "bold",
    fontSize: 12,
    fontFamily: "SFProText",
    color: AppColors.primaryColor,
  },
  dateText: {
    fontWeight: "600",
    fontSize: 10,
    fontFamily: "SFProText",
    color: AppColors.primaryColor,
    textAlign: "center",
  },
  timeText: {
    fontWeight: "bold",
    fontSize: 12,
    fontFamily: "SFProText",
    color: AppColors.secondaryColor,
    textAlign: "center",
  },
});

function MemoryContainer({ memoryService }: { memoryService: MemoryService }) {
  const [chatList, setChatList] = useState<ChatModel[] | null>(null);
  const [componentStatus, setComponentStatus] = useState<ComponentStatus>("idle");

  // --- Load Memories ---
  const loadMemories = async () => {
    if (!memoryService) return;

    try {
      setComponentStatus("initializing");
      const chats = await memoryService.getOngoingChats();
      setChatList(chats);
      setComponentStatus("idle");
    } catch (err) {
      console.error(`Failed to get chats`, err);
      setComponentStatus("error");
    }
  };

  useEffect(() => {
    loadMemories();
  }, [memoryService]);

  // --- Build Content UI ---
  const buildContent = () => {
    if (componentStatus === "error") {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load memories.</Text>
          <TouchableOpacity onPress={loadMemories}>
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (componentStatus === "initializing") {
      return (
        <ActivityIndicator
          style={{ alignSelf: "center" }}
          color={AppColors.primaryColor}
          size="large"
        />
      );
    }

    return (
      <ScrollView 
        horizontal 
        contentContainerStyle={{ gap: 8}}
        showsHorizontalScrollIndicator = {false}
      >
        {chatList && chatList.map((chat) => <MemoryCard key={chat.id} chat={chat} />)}
      </ScrollView>
    );
  };

  // do not render this container when the chatlist is empty
  if (chatList && chatList.length === 0) {
    return null;
  }
  return (
    <GenericContainer borderRadius={10}>
      <View style={styles.contentContainer}>
        {/* HEADER */}
        <View style={styles.header}>
          <Entypo size={24} name="back-in-time" color={AppColors.primaryColor} />
          <Text style={styles.headerText}>Jump Back</Text>
          <Entypo size={24} name="dots-three-horizontal" color={AppColors.primaryColor} />
        </View>

        {/* CONTENT */}
        {buildContent()}
      </View>
    </GenericContainer>
  );
}

export default memo(MemoryContainer);

const styles = StyleSheet.create({
  contentContainer: {
    width: "100%",
    padding: 16,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
  },
  headerText: {
    flex: 1,
    marginHorizontal: 18,
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: "SFProText",
    color: AppColors.primaryColor,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 20,
    alignSelf: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 8,
  },
  retryText: {
    color: AppColors.primaryColor,
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    color: AppColors.primaryColor,
    opacity: 0.6,
    fontSize: 14,
    marginTop: 10,
  },
});
