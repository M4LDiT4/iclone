import { createContext, useContext } from "react";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import UserData from "@/data/application/UserData";

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  profile: UserData | null;
  setProfile: (userData: UserData| null) => void
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => useContext(AuthContext);
