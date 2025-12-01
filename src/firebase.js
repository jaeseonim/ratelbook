import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDittScihABdOY0OdaiOAfvOB0Be_mOLZs",
    authDomain: "ratelbook-21e46.firebaseapp.com",
    projectId: "ratelbook-21e46",
    storageBucket: "ratelbook-21e46.firebasestorage.app",
    messagingSenderId: "79023624830",
    appId: "1:79023624830:web:df3264b150eb51bff5be2f",
    measurementId: "G-12ZRW4TXB3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
