import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  useEffect(()=>{
    const un = onAuthStateChanged(auth, u=> setUser(u))
    return ()=> un()
  },[])

  const signIn = (email, password)=> signInWithEmailAndPassword(auth, email, password)
  const signUp = (email, password)=> createUserWithEmailAndPassword(auth, email, password)
  const signOutUser = ()=> signOut(auth)

  return <AuthContext.Provider value={{ user, signIn, signUp, signOutUser }}>{children}</AuthContext.Provider>
}

export const useAuth = ()=> useContext(AuthContext)
