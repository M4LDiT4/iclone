import UserData from "@/data/application/UserData";
import { getApp } from "@react-native-firebase/app";
import { getAuth, onAuthStateChanged, FirebaseAuthTypes, createUserWithEmailAndPassword } from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore';

class AuthService {
  private auth = getAuth(getApp());

  getCurrentUser(): FirebaseAuthTypes.User | null {
    return this.auth.currentUser;
  }

  onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  async signUpWithEmail(user: UserData) {
    try {
      await createUserWithEmailAndPassword(this.auth, user.email, user.password);
      await firestore().collection('users').add(user.toFirebaseJson());
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        throw new Error("Email already in use");
      }
      if (err.code === 'auth/invalid-email') {
        throw new Error("Invalid email. Please check email format");
      }
      throw new Error("Unknown error occurred while signing up with Firebase");
    }
  }
}

export default new AuthService();