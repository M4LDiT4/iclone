// components/headers/ChatHeader.tsx
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, View, Text, TouchableOpacity, Pressable } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import AppColors from "@/core/styling/AppColors";
import { router } from "expo-router";
import { useState } from "react";
import { Menu } from "react-native-paper";

type ChatHeaderProps = {
  label: string;
  chatId: string;
  onSave: (chatId: string) => void;
};

export default function ChatHeader({ label, chatId, onSave }: ChatHeaderProps) {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const openMenu = () => {
    setVisible(true);
    console.log('open');
  };
  const closeMenu = () => {
    setVisible(false);
    console.log('close');
  };

  return (
    <View style={[styles.container, {height: 70 + insets.top}]}>
      <View style ={[styles.statusBar, {height: insets.top}]} ></View>
      <View style={styles.contentContainer}>
        {/* Back button */}
        <TouchableOpacity onPress={handleGoBack}>
          <Feather name="arrow-left-circle" size={32} color={AppColors.secondaryColor} />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.labelText}>{label}</Text>

        {/* Kebab menu */}
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity style={styles.iconButton} onPress={openMenu}>
              <MaterialIcons name="more-vert" size={28} color={AppColors.secondaryColor} />
            </TouchableOpacity>
          }
        >
          <Menu.Item
            onPress={() => {
              onSave(chatId);
              closeMenu();
            }}
            title="Save Conversation"
          />
        </Menu>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    overflow: "visible",
    zIndex: 10,
  },
  statusBar: {
    backgroundColor: AppColors.primaryColor,
    width: '100%'
  },
  contentContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  labelText: {
    fontFamily: "SFProText",
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: 28,
    color: AppColors.primaryColor,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
});