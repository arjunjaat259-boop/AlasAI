import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth";

// Aapka asli config jo screenshots mein dikh raha hai
const firebaseConfig = {
  apiKey: "AIzaSyCJMPopWQ2bDQOcTRsnTM2ELgTyf4IWJAY",
  authDomain: "gyan-ai-87b44.firebaseapp.com",
  projectId: "gyan-ai-87b44",
  storageBucket: "gyan-ai-87b44.firebasestorage.app",
  messagingSenderId: "673168575822",
  appId: "1:673168575822:web:ffa95ed4c7ffc1fee4621f",
  measurementId: "G-CY297XBF7M"
};

// Firebase initialize karein
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Taaki har baar account select karne ka mauka mile
provider.setCustomParameters({
  prompt: 'select_account'
});

// Redirect mode: Ye sabse best hai, isme popup block nahi hota
export const signInWithGoogle = () => signInWithRedirect(auth, provider);

// Logout function
export const logout = () => signOut(auth);
