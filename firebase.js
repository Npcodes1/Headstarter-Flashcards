// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLBfI1P3gNDRDfjtJveKAO0SAzNNAVYd4",
  authDomain: "flashcard-saas-8748b.firebaseapp.com",
  projectId: "flashcard-saas-8748b",
  storageBucket: "flashcard-saas-8748b.appspot.com",
  messagingSenderId: "904778721458",
  appId: "1:904778721458:web:67db471d54ba24a70a41ab",
  measurementId: "G-9B2R9JNJ08",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
