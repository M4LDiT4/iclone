import AuthGate from "@/components/application/authGate";
import HomeHeader from "@/components/headers/homeHeader";
import AppColors from "@/core/styling/AppColors";
import { Stack } from "expo-router";
import { PaperProvider} from "react-native-paper";

export default function RootLayout() {
  return (
       <PaperProvider>
          <AuthGate>
            <Stack 
              screenOptions={{
                headerShown: false,
                headerStyle: {
                  backgroundColor: AppColors.backgroundColor,
                },
                headerShadowVisible: false
              }}
            >
            <Stack.Screen
              name = 'home'
              options={{
                headerShown: true,
                header: () => <HomeHeader/>
              }}
            />
            <Stack.Screen
              name="signUp"
            />
            <Stack.Screen
              name="signIn"
            />
          </Stack>
        </AuthGate>
    </PaperProvider>
  )
}
