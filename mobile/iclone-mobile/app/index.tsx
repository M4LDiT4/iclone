import { Center } from "@/components/layout/layout";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView>
      <Center style ={{flex:1}}>
          <Text>Starting the app...</Text>
      </Center>
    </SafeAreaView>
  );
}
