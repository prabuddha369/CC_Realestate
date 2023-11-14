'use client';
import { useContext, createContext, useState, useEffect } from "react";
import {
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase";
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const facebookSignIn = () => {
    const provider = new FacebookAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const signUpWithEmailAndPassword = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithEmailPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };


  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unSub();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        googleSignIn,
        facebookSignIn,
        logOut,
        signUpWithEmailAndPassword,
        signInWithEmailPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
