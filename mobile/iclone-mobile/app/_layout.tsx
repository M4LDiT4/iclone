import AuthGate from "@/components/application/authGate";
import HomeHeader from "@/components/headers/homeHeader";
import AppColors from "@/core/styling/AppColors";
import { LinearGradient } from "expo-linear-gradient";
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
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="authentication/signUp"
            />
            <Stack.Screen
              name="authentication/signIn"
            />
          </Stack>
        </AuthGate>
    </PaperProvider>
  )
}
