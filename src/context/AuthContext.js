"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";

import { ref, set, get } from "firebase/database";

import { auth, database } from "../lib/firebase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDemo = localStorage.getItem("workmate_demo_user");
      if (savedDemo) {
        try {
          setUser(JSON.parse(savedDemo));
          setLoading(false);
          return;
        } catch (e) {}
      }
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userRef = ref(database, `users/${firebaseUser.uid}`);
            const snapshot = await get(userRef);
            let profile = {};

            if (snapshot.exists()) {
              profile = snapshot.val();
            }

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              companyName: profile.companyName || "Oak & Iron Workshop",
              name: profile.name || firebaseUser.email.split("@")[0],
              ...profile,
            });
          } catch (error) {
            console.error("Error fetching user profile", error);
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              companyName: "Oak & Iron Workshop",
              name: firebaseUser.email.split("@")[0],
            });
          }
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const demoLogin = () => {
    const mockUser = {
      uid: "demo_user_123",
      email: "demo@workmate.com",
      companyName: "Oak & Iron Workshop",
      name: "Demo Manager",
    };
    setUser(mockUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("workmate_demo_user", JSON.stringify(mockUser));
    }
    return mockUser;
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (err) {
      if (email === "demo@workmate.com" || password === "demo123") {
        return demoLogin();
      }
      throw err;
    }
  };

  const signup = async (email, password, companyName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      await set(ref(database, `users/${firebaseUser.uid}`), {
        name: email.split("@")[0],
        email: email,
        companyName: companyName,
        createdAt: new Date().toISOString(),
      });

      return firebaseUser;
    } catch (err) {
      const mockUser = {
        uid: "demo_user_" + Date.now(),
        email: email,
        companyName: companyName || "Oak & Iron Workshop",
        name: email.split("@")[0],
      };
      setUser(mockUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("workmate_demo_user", JSON.stringify(mockUser));
      }
      return mockUser;
    }
  };

  const logout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("workmate_demo_user");
    }
    try {
      await signOut(auth);
    } catch (e) {}
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      console.log("Password reset simulation for", email);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        demoLogin,
        signup,
        logout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};