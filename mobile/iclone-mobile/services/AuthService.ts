import UserData from "@/data/application/UserData";
import { getApp } from "@react-native-firebase/app";
import { getAuth, onAuthStateChanged, FirebaseAuthTypes, createUserWithEmailAndPassword } from "@react-native-firebase/auth";
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
      console.error(err);
      if (err.code === 'auth/email-already-in-use') throw new Error("Email already in use");
      if (err.code === 'auth/invalid-email') throw new Error("Invalid email format");
      throw new Error("Unknown error occurred while signing up: " + err.message);
    }
  }
}

export default new AuthService();
