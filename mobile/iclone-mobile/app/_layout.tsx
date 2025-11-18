import HomeHeader from "@/components/headers/homeHeader";
import ScreenHeader from "@/components/headers/screenHeader";
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
    >
    </Stack.Screen>
    <Stack.Screen
      name="chat"
      options={{
        header: () => <ScreenHeader title="Converse"/>,
      }}
    />
    <Stack.Screen
      name='memory'
      options={{
        header: () => <ScreenHeader title="Memories"/>
      }}
    >
    </Stack.Screen>
  </Stack>
}
