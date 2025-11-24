import UserData from "@/data/application/UserData";
import { getApp } from "@react-native-firebase/app";
import { getAuth, onAuthStateChanged, FirebaseAuthTypes, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore';

import { getApps } from '@react-native-firebase/app';

console.log('Firebase apps:', getApps());


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
      const { user: firebaseUser } = await createUserWithEmailAndPassword(this.auth, user.email, user.password);
      await firestore().collection('users').doc(firebaseUser.uid).set(user.toFirebaseJson());
    } catch (err: any) {
      console.error(`Failed to signup with email: ${err}`)
      if (err.code === 'auth/email-already-in-use') throw new Error("Email already in use");
      if (err.code === 'auth/invalid-email') throw new Error("Invalid email format");
      throw new Error("Unknown error occurred while creating account");
    }
  }

  async signInWithEmail(email: string, password: string) {
    // guard clause to prevent execution of function to invalid inputs
    if (email.length === 0 || password.length === 0) {
      throw new Error("Email or password must not be empty");
    }
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (err: any) {
      switch (err.code) {
        case "auth/invalid-email":
          throw new Error("The email address is not valid.");
        case "auth/user-disabled":
          throw new Error("This account has been disabled. Contact support.");
        case "auth/user-not-found":
          throw new Error("No account exists with this email.");
        case "auth/wrong-password":
          throw new Error("Incorrect password. Please try again.");
        case "auth/network-request-failed":
          throw new Error("Network error. Check your internet connection.");
        case "auth/too-many-requests":
          throw new Error("Too many failed attempts. Please wait and try again later.");
        default:
          throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  }

}

export default new AuthService();
