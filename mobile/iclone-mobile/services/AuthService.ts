import { AuthServiceError } from "@/core/errors/AuthServiceError";
import { ValidationError } from "@/core/errors/ValidationError";
import UserData from "@/data/application/UserData";
import { getApp } from "@react-native-firebase/app";
import { getAuth, onAuthStateChanged, FirebaseAuthTypes, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '960913578128-jai9003ivpjh8jsvgskr2f8d7h0r214g.apps.googleusercontent.com'
});

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
      if (err.code === 'auth/email-already-in-use') throw new AuthServiceError("Email already in use");
      if (err.code === 'auth/invalid-email') throw new AuthServiceError("Invalid email format");
      throw new AuthServiceError("Unknown error occurred while creating account with email");
    }
  }

  async signInWithEmail(email: string, password: string) {
    // guard clause to prevent execution of function to invalid inputs
    if (email.length === 0 || password.length === 0) {
      throw new ValidationError("Email or password must not be empty");
    }
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (err: any) {
      switch (err.code) {
        case "auth/invalid-email":
          throw new AuthServiceError("The email address is not valid.");
        case "auth/user-disabled":
          throw new AuthServiceError("This account has been disabled. Contact support.");
        case "auth/user-not-found":
          throw new AuthServiceError("No account exists with this email.");
        case "auth/wrong-password":
          throw new AuthServiceError("Incorrect password. Please try again.");
        case "auth/network-request-failed":
          throw new AuthServiceError("Network error. Check your internet connection.");
        case "auth/too-many-requests":
          throw new AuthServiceError("Too many failed attempts. Please wait and try again later.");
        default:
          throw new AuthServiceError("An unexpected error occurred. Please try again.");
      }
    }
  }

  async authWithGoogle() {
    try{
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();

      var idToken = signInResult.data?.idToken;

      if(!idToken){
        throw new AuthServiceError("Failed to authenticate using your Google account");
      }
      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(this.auth, googleCredential);
    }catch(err){
      if(err instanceof AuthServiceError){
        throw err;
      }
      throw new AuthServiceError("Unexpected error occured while authenticating with your Google account");
    }
  }

}

export default new AuthService();
