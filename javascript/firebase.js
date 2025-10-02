// /javascript/firebase.js
// Import Firebase SDK (modular) dari CDN
import { initializeApp } 
  from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } 
  from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import { getAuth } 
  from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore } 
  from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyx1JA4LK0da78MriEobCRbvjHWB-XYGw",
  authDomain: "restoransehat.firebaseapp.com",
  projectId: "restoransehat",
  storageBucket: "restoransehat.firebasestorage.app",
  messagingSenderId: "599361764749",
  appId: "1:599361764749:web:d85461c63fd78fdc9451c4",
  measurementId: "G-E6NJ55DMEX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);

// kalau mau login google biasa tanpa scope tambahan, baru pakai ini:
// import { GoogleAuthProvider } 
//   from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
// export const provider = new GoogleAuthProvider();
