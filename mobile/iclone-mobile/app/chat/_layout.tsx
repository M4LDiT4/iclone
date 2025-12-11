import GenericHeader from "@/components/headers/genericHeader";
import { ChatProvider } from "@/core/contexts/chatContext";
import { Stack } from "expo-router";

export default function ChatScreenLayout() {
  return <ChatProvider>
    <Stack>
      <Stack.Screen
        name="[chatId]"
        options={{
          headerShown: true,
          header: ()=> <GenericHeader label={"converse"}/>
        }}
      />
      <Stack.Screen
        name="confirmMemory"
        options={{
          headerShown: true,
          header: ()=> <GenericHeader label="Preview"/>
        }}
      />
    </Stack>
  </ChatProvider>
}