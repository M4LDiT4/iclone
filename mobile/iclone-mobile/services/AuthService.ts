import { AuthServiceError } from "@/core/errors/AuthServiceError";
import { ValidationError } from "@/core/errors/ValidationError";
import UserData from "@/data/application/UserData";
import { date } from "@nozbe/watermelondb/decorators";
import { getApp } from "@react-native-firebase/app";
import { getAuth, onAuthStateChanged, FirebaseAuthTypes, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "@react-native-firebase/auth";
import firestore, { collection, doc, getDoc, getFirestore, serverTimestamp, setDoc } from '@react-native-firebase/firestore';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '960913578128-jai9003ivpjh8jsvgskr2f8d7h0r214g.apps.googleusercontent.com'
});

class AuthService {

  private auth = getAuth(getApp());
  private store = getFirestore(getApp());

  getCurrentUser(): FirebaseAuthTypes.User | null {
    return this.auth.currentUser;
  }

  onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  async signUpWithEmail(user: UserData) {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(this.auth, user.email, user.password);
      await setDoc(
        doc(collection(this.store, 'users'), firebaseUser.uid),
        {
          ...user.toFirebaseJson(),
          createdAt: serverTimestamp()
        },
        {merge: true}
      )
      await this.auth.currentUser?.reload();
      const currentUser = this.auth.currentUser;
      if(currentUser == null){
        throw new AuthServiceError("We have difficulty creating your account right now. Please try again later");
      }
      await currentUser.updateProfile({
        displayName: user.username
      });
    } catch (err: any) {
      console.error(`Failed to signup with email: ${err}`)
      if (err.code === 'auth/email-already-in-use') throw new AuthServiceError("Email already in use");
      if (err.code === 'auth/invalid-email') throw new AuthServiceError("Invalid email format");
      throw new AuthServiceError("Unknown error occurred while creating account with email");
    }
  }

  async hasFinishedOnboarding(user:FirebaseAuthTypes.User): Promise<boolean>{
    if(!user) return false;
    const userDocRef = doc(this.store, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);

    if(!docSnap.exists()){
      return false; // no profile yet -> not onboarded
    }
    const data = docSnap.data();
    return data?.onboardingDone === true;
  }

  async signInWithEmail(email: string, password: string) {
    // guard clause to prevent execution of function to invalid inputs
    if (email.length === 0 || password.length === 0) {
      throw new ValidationError("Email or password must not be empty");
    }
    try {
      // no need to update the displayName of the user as it is automatically done by firebase
      await signInWithEmailAndPassword(this.auth, email, password);
      await this.auth.currentUser?.reload(); // make sure that the new user is registered
    } catch (err: any) {
      if(err instanceof ValidationError){
        throw err;
      }
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
  /** ### Signs in/up the using google
   * - if google account is already registered, user is signed in
   * - otherwise creates a new account and signs in the user
   * - we can extend or break down later to show errors when signing up with already existing account
   */
  async authWithGoogle(): Promise<FirebaseAuthTypes.UserCredential> {
    try{
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();

      var idToken = signInResult.data?.idToken;
      // null guard for idToken
      if(!idToken){
        throw new AuthServiceError("Failed to authenticate using your Google account");
      }
      const googleCredential = GoogleAuthProvider.credential(idToken);
      // no need to udpate the displayName as firebase does this for us
      const credential = await signInWithCredential(this.auth, googleCredential);

      const user = credential.user;
      await setDoc(
        doc(collection(this.store, 'users'), user.uid),
          {
            username: user.displayName ?? "",
            email: user.email ?? "",
            contactNumber: user.phoneNumber ?? "",
            onboardingDone: false, // default flag
            createdAt: firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
      );

      return credential;
    }catch(err){
      if(err instanceof AuthServiceError){
        throw err;
      }
      throw new AuthServiceError("Unexpected error occured while authenticating with your Google account");
    }
  }
}

export default new AuthService();
