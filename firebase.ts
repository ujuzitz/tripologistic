import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrg7EjIDc_pAP4s6SE9_Jen9EnidoP82M",
  authDomain: "tripologistic.firebaseapp.com",
  projectId: "tripologistic",
  storageBucket: "tripologistic.firebasestorage.app",
  messagingSenderId: "28180529128",
  appId: "1:28180529128:web:61291a4765771a5457ee5d",
  measurementId: "G-XC3J6M8F2K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, analytics };