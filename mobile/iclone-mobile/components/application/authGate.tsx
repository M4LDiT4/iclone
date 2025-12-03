import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AuthService from "@/services/AuthService";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import AppColors from "@/core/styling/AppColors";
import { AuthContext } from "@/core/contexts/authContext";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((userState) => {
      setUser(userState);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      router.replace("/onboarding/setName");
    } else {
      router.replace("/signIn");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      // TODO: Add a proper loader
      <View style={styles.initialScreenContainer}>
        <ActivityIndicator size="large" color={AppColors.primaryColor}/>
        <Text style = {styles.titleText}>Starting App...</Text>
      </View>
    );
  }

  // Render children once auth state is known
  return (
    <AuthContext.Provider value={{user: user}}>
      {children}
    </AuthContext.Provider>
  )
}

const styles = StyleSheet.create({
  initialScreenContainer : {
    backgroundColor: AppColors.primaryColor,
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  titleText : {
    fontSize: 20,              // Larger than body text
    fontWeight: '700',         // Bold for emphasis
    color: '#023E65',          // Primary or brand color
    textAlign: 'center',       // Centered in the modal
    marginBottom: 12,          // Space below before content
    fontFamily: 'SFProText',   // Keep consistent with your app typography
  },
})