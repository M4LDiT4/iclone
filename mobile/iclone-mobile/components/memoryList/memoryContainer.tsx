import { memo, useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import GenericContainer from "../containers/genericContainer";
import { Entypo } from "@expo/vector-icons";
import AppColors from "@/core/styling/AppColors";
import MemoryCard from "./memoryCard";
import { TagModel } from "@/data/database/models/tagModel";
import TagService from "@/services/TagService";
import TagIconRenderer from "../icons/tagIconRenderer";
import { MemoryService } from "@/services/MemoryService";
import ChatModel from "@/data/database/models/chatModel";
import ComponentStatus from "@/core/types/componentStatusType";
import database from "@/data/database/index.native";
import { ActivityIndicator } from "react-native-paper";
import { MemoryDBRepository } from "@/services/localDB/memoryDBRepository";

function MemoryContainer({
  tag,
  tagService,
}: {
  tag: TagModel;
  tagService: TagService;
}) {
  const [chatList, setChatList] = useState<ChatModel[]>([]);
  const [memoryService, setMemoryService] = useState<MemoryService | null>(null);
  const [componentStatus, setComponentStatus] = useState<ComponentStatus>("idle");

  // --- Initialize MemoryService ---
  useEffect(() => {
    const initialize = () => {
      setComponentStatus("initializing");
      const memoryRepository = new MemoryDBRepository({ database });
      const newMemoryService = new MemoryService({ memoryRepository });
      setMemoryService(newMemoryService);
      setComponentStatus("idle");
    };

    initialize();
  }, []);

  // --- Load Memories ---
  const loadMemories = async () => {
    if (!memoryService) return;

    try {
      setComponentStatus("initializing");
      const chats = await memoryService.getMemoriesByTagId(tag.id, { limit: 5 });
      setChatList(chats);
      setComponentStatus("idle");
    } catch (err) {
      console.error(`Failed to get chats for tag: ${tag.name}`, err);
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
      return <ActivityIndicator color={AppColors.primaryColor} size="large" />;
    }

    if (chatList.length === 0) {
      return <Text style={styles.emptyText}>No memories yet.</Text>;
    }

    return (
      <ScrollView contentContainerStyle={{ gap: 8, width: '100%'}}>
        {chatList.map((chat) => (
          <MemoryCard key={chat.id} chat={chat} />
        ))}
      </ScrollView>
    );
  };

  return (
    <GenericContainer borderRadius={10}>
      <View style={styles.contentContainer}>
        {/* HEADER */}
        <View style={styles.header}>
          <TagIconRenderer
            tagId={tag.id}
            tagName={tag.name}
            tagService={tagService}
            iconLibrary={tag.iconLibrary}
            iconName={tag.iconName}
          />
          <Text style={styles.headerText}>{tag.name}</Text>
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

  // New styles for improved UI
  errorContainer: {
    alignItems: "center",
    paddingVertical: 20,
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
