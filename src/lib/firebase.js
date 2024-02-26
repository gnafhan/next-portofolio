// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqaXJ0x7khlQ16Pp3YA6e3goQEd-6E0Sw",
  authDomain: "nextlink-521b8.firebaseapp.com",
  projectId: "nextlink-521b8",
  storageBucket: "nextlink-521b8.appspot.com",
  messagingSenderId: "909256971354",
  appId: "1:909256971354:web:7e489207195d5afcdaf463",
  measurementId: "G-35YDRH0M0E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);