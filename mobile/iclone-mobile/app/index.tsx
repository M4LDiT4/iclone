import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";

export default function Index() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);

  useEffect(() => {
    if (isAuthenticated !== null) {
      requestAnimationFrame(() => {
        router.replace(isAuthenticated ? "/home" : "/signUp");
      });
    }
  }, [isAuthenticated]);

  return (
    <SafeAreaView>
      <Text>Index</Text>
    </SafeAreaView>
  )
}