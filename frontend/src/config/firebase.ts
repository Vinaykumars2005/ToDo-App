//ToDoApp\frontend\src\config\firebase.ts

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3Zub4YJNvnC0GyhQyi0kegmTLMiXjwP0",
  authDomain: "todo-f05c8.firebaseapp.com",
  projectId: "todo-f05c8",
  storageBucket: "todo-f05c8.appspot.com",
  messagingSenderId: "465311721637",
  appId: "1:465311721637:web:517f00445c3397aead054c",
  measurementId: "G-CZED31EXCY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
