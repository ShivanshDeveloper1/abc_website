"use client"

import { onAuthStateChanged } from "firebase/auth"

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase";



const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Mapping Firebase user to match Clerk's object structure 
        // to keep your Navbar and logic as similar as possible
        setUser({
          id: currentUser.uid,
          fullName: currentUser.displayName,
          firstName: currentUser.displayName?.split(" ")[0] || "",
          lastName: currentUser.displayName?.split(" ").slice(1).join(" ") || "",
          imageUrl: currentUser.photoURL,
          emailAddresses: [{ emailAddress: currentUser.email }],
        });
      } else {
        setUser(null);
      }
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to mimic Clerk's useUser
export const useUser = () => useContext(AuthContext);