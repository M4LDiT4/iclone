import { createContext, useContext } from "react";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
});

export const useAuth = () => useContext(AuthContext);
