import { memo, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import GenericContainer from "../containers/genericContainer";
import { Entypo, Ionicons } from "@expo/vector-icons";
import AppColors from "@/core/styling/AppColors";
import MemoryCard from "./memoryCard";
import { TagModel } from "@/data/database/models/tagModel";
import TagService from "@/services/TagService";
import TagIconRenderer from "../icons/tagIconRenderer";


function MemoryContainer({
    tag,
    tagService
  }: {
    tag: TagModel,
    tagService: TagService
  }
  ){
  return <GenericContainer borderRadius={10}>
    <View style = {styles.contentContainer}>
      <View style = {styles.header}>
        {/* generate icon here */}
        <TagIconRenderer
          tagId= {tag.id}
          tagName={tag.name}
          tagService={tagService}
          iconLibrary={tag.iconLibrary}
          iconName={tag.iconName}
        />
        <Text style = {styles.headerText}>{tag.name}</Text>
        <Entypo size={24} name="dots-three-horizontal" color={AppColors.primaryColor}/>
      </View>
      <ScrollView horizontal>
        <MemoryCard/>
      </ScrollView>
    </View>
  </GenericContainer>
}

export default memo(MemoryContainer)

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 16
  },
  headerText: {
    flex: 1,
    marginHorizontal: 18,
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: "SFProText",
    color: AppColors.primaryColor,
  }
});