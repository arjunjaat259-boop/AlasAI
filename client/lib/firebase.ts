import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJMPopWQ2bDQOcTRsnTM2ELgTyf4IWJAY",
  authDomain: "gyan-ai-87b44.firebaseapp.com",
  projectId: "gyan-ai-87b44",
  storageBucket: "gyan-ai-87b44.firebasestorage.app",
  messagingSenderId: "673168575822",
  appId: "1:673168575822:web:ffa95ed4c7ffc1fee4621f", // Aapke screenshot se verified
  measurementId: "G-CY297XBF7M"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Popup wala method use karte hain, ye jyada fast hai
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Login Error:", error);
    return null;
  }
};

export const logout = () => signOut(auth);
