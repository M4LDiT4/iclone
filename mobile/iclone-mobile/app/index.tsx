import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, ActivityIndicator, View } from "react-native";
import AuthService from "@/services/AuthService";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";


export default function Index() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((userState) => {
      setUser(userState);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Navigate once auth state is known
  useEffect(() => {
    if (isLoading) return;

    if (user == null) {
      router.replace("/signIn");
    } else {
      router.replace("/home");
    }
  }, [user, isLoading, router]);

  // Render loading indicator until auth state resolves
  if (isLoading) {
    return (
      <SafeAreaView>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
          <Text>Checking authentication...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Fallback UI (should rarely be seen since router.replace runs)
  return (
    <SafeAreaView>
      <Text>Index</Text>
    </SafeAreaView>
  );
}