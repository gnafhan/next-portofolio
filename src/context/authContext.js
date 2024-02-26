import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import {createContext, useContext, useEffect, useState} from "react"


const AuthContext = createContext()

export const AuthContextProvider =({children})=>{
    const [user, setUser] = useState(" ")

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
      };
    
      const logOut = () => {
        signOut(auth);
      };
    
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
        return () => unsubscribe();
      }, [user]);
    
      return (
        <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
          {children}
        </AuthContext.Provider>
      );
    };
    
    export const UserAuth = () => {
      return useContext(AuthContext);
    };