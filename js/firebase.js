// js/firebase.js – Firebase initialization and reusable helpers
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3tckDMyG8_GsHWF6BV-dus-qGFj8mMC4",
  authDomain: "workmate-c9928.firebaseapp.com",
  databaseURL: "https://workmate-c9928-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "workmate-c9928",
  storageBucket: "workmate-c9928.firebasestorage.app",
  messagingSenderId: "1067562101456",
  appId: "1:1067562101456:web:63e53fad264f6b6fe1ccd5",
  measurementId: "G-NNLBJK92KY"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, set, onValue };
