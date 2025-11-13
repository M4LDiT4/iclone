import ChatHeader from "@/components/headers/chatHeader";
import HomeHeader from "@/components/headers/homeHeader";
import AppColors from "@/core/styling/AppColors";
import { Stack } from "expo-router";
import { View, Text } from "react-native";

export default function RootLayout() {
  return <Stack 
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: AppColors.backgroundColor,
      },
      headerShadowVisible: false
    }}
  >
    <Stack.Screen
      name="index"
      options={{
        header: () => <HomeHeader/>
      }}
    >
    </Stack.Screen>
    <Stack.Screen
      name="chat"
      options={{
        header: () => <ChatHeader/>,
      }}
    />
  </Stack>
}
