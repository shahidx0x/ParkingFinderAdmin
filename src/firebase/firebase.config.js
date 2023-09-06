// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCipUwujka205S0vAQ6pNpX5IzM48XnLg4",
  authDomain: "parking-finder-ff81d.firebaseapp.com",
  projectId: "parking-finder-ff81d",
  storageBucket: "parking-finder-ff81d.appspot.com",
  messagingSenderId: "535534289662",
  appId: "1:535534289662:web:e01abd9a08c9f0b50f9baf",
  measurementId: "G-46JWMVZEYK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export default app;
