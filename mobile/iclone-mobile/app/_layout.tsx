import ChatHeader from "@/components/headers/chatHeader";
import GenericHeader from "@/components/headers/genericHeader";
import HomeHeader from "@/components/headers/homeHeader";
import AppColors from "@/core/styling/AppColors";
import { Stack } from "expo-router";

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
    />
    <Stack.Screen
      name = 'home'
      options={{
        header: () => <HomeHeader/>
      }}
    />
    <Stack.Screen
      name="chat"
      options={{
        header: () => <GenericHeader label="Converse"/>,
      }}
    />
    <Stack.Screen
      name="signUp"
      options ={{headerShown: false}}
    />
    <Stack.Screen
      name="signIn"
      options={{headerShown: false}}
    />
  </Stack>
}
