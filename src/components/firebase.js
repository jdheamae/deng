import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA9YteNNPR6tmUApK9TUrrnLxIS_Dde9f8",
    authDomain: "polgary-fbb40.firebaseapp.com",
    projectId: "polgary-fbb40",
    storageBucket: "polgary-fbb40.firebasestorage.app",
    messagingSenderId: "109233697092",
    appId: "1:109233697092:web:1cad22c201072c2c872711",
    measurementId: "G-CWDCKBRHM2"   
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);

export { db };