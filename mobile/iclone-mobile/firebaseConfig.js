// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getApp } from "@react-native-firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdfWJrtwMFAZSsVMqR47st_bPRCX7kwII",
  authDomain: "eterne-fcd6e.firebaseapp.com",
  projectId: "eterne-fcd6e",
  storageBucket: "eterne-fcd6e.firebasestorage.app",
  messagingSenderId: "960913578128",
  appId: "1:960913578128:web:05e2fa50f39ecd7f0c6015",
  measurementId: "G-3J0TJD01VP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default getApp(app);