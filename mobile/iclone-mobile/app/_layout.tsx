import HomeHeader from "@/components/headers/home_header";
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
  </Stack>
}
