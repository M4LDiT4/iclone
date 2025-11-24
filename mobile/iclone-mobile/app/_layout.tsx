import AuthGate from "@/components/application/authGate";
import ChatHeader from "@/components/headers/chatHeader";
import GenericHeader from "@/components/headers/genericHeader";
import HomeHeader from "@/components/headers/homeHeader";
import AppColors from "@/core/styling/AppColors";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthGate>
      <Stack 
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: AppColors.backgroundColor,
        },
        headerShadowVisible: false
      }}>
      <Stack.Screen
        name = 'home'
        options={{
          headerShown: true,
          header: () => <HomeHeader/>
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          headerShown: true,
          header: () => <GenericHeader label="Converse"/>,
        }}
      />
      <Stack.Screen
        name="signUp"
      />
      <Stack.Screen
        name="signIn"
      />
    </Stack>
  </AuthGate>)
}
