import { createContext, useContext } from "react";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  displayName: string | null;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  displayName: null,
});

export const useAuth = () => useContext(AuthContext);
