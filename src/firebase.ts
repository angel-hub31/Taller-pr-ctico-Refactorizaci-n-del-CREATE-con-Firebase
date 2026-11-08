import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDryfNygVWIZwaohWtKAo0rHy5VbhGVjOM",
    authDomain: "curso-firebase-3b90e.firebaseapp.com",
    projectId: "curso-firebase-3b90e",
    storageBucket: "curso-firebase-3b90e.firebasestorage.app",
    messagingSenderId: "215465930726",
    appId: "1:215465930726:web:eedf4e4351fa1983d67027"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export { db };

