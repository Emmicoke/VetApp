// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC28fEwH_GjGA-bX51QYL0t1dntSwPoPCo",
  authDomain: "vet-app-f0299.firebaseapp.com",
  projectId: "vet-app-f0299",
  storageBucket: "vet-app-f0299.appspot.com",
  messagingSenderId: "152348275870",
  appId: "1:152348275870:web:39909fe85aec72c531f78f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);

export default app;