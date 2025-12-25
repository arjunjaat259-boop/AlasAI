// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJMPopWQ2bDQOcTRsnTM2ELgTyf4IWJAY",
  authDomain: "gyan-ai-87b44.firebaseapp.com",
  projectId: "gyan-ai-87b44",
  storageBucket: "gyan-ai-87b44.firebasestorage.app",
  messagingSenderId: "673168575822",
  appId: "1:673168575822:web:ffa95ed4c7ffc1fee4621f",
  measurementId: "G-CY297XBF7M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
