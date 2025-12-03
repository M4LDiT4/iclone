import { OnboardingProvider } from "@/core/contexts/onboardingContext";
import { Stack } from "expo-router";
import React from "react";

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{headerShown: false}}/>
    </OnboardingProvider>
  );
}
