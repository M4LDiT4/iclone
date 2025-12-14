import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AuthService from "@/services/AuthService";
import {FirebaseAuthTypes } from "@react-native-firebase/auth";
import AppColors from "@/core/styling/AppColors";
import { AuthContext } from "@/core/contexts/authContext";
import { AuthServiceError } from "@/core/errors/AuthServiceError";
import UserData from "@/data/application/UserData";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [profile, setProfile] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((userState) => {
      handleChangeCredentials(userState);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      // go to home if profile and user are not null and the user has also finished the onboarding
      if (profile && profile.onboardingDone){
        router.replace("/home");
      // go to the onboarding screen if profile is null (e.g. the user has not finished the onboarding yet so there is no profile)
      // or they have profile but they havent finished the oboarding yet
      } else {
        router.replace("/onboarding/setName");
      }
    } else {
      router.replace("/authentication/signIn");
    }
  }, [user, isLoading, router]);

  const handleChangeCredentials = async (userState: FirebaseAuthTypes.User | null) => {
    try {
      if (!userState) {
        setUser(null);
      } else {
        //wait for the profile query before 
        const newProfile = await AuthService.getUserProfile(userState.uid);
        setUser(userState);
        setProfile(newProfile);
        setError(null);
      }
    } catch (err) {
      if (err instanceof AuthServiceError) {
        console.error(`AuthServiceError encountered while authenticating: ${err}`);
        setError(err.message);
      } else {
        console.error(`Unexpected error occurred while authenticating: ${err}`);
        setError("We ran into a problem signing you in. Please try again or check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.initialScreenContainer}>
        <ActivityIndicator size="large" color={AppColors.primaryColor} />
        <Text style={styles.titleText}>Starting App...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.initialScreenContainer}>
        <Text style={styles.titleText}>⚠️ {error}</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user: user, 
      profile,
      setProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  initialScreenContainer : {
    backgroundColor: AppColors.backgroundColor,
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