import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBFchpoEkXIl0HRkBtTMjFLKi_x5lhZJMQ",
  authDomain: "authentication-62d5b.firebaseapp.com",
  projectId: "authentication-62d5b",
  storageBucket: "authentication-62d5b.firebasestorage.app",
  messagingSenderId: "237474507063",
  appId: "1:237474507063:web:cf308bcc02e1cf894c52b2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);