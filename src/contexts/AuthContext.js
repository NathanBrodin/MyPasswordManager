import React, { useContext, createContext, useEffect, useState } from 'react'
import { auth } from "../firebase"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updatePassword } from "firebase/auth"

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)


    function signup(email, password) {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCrendtial) => {
            return userCrendtial.user
        })
        .catch((error) => {
            // TODO : create error for weak password
            console.error("Unable to create new user : " + error.code + error.message);
        })
    }

    function login(email, password) {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCrendtial) => {
            return userCrendtial.user
        })
        .catch((error) => {
            console.error("Unable to sign in : " + error.code + error.message);
        })
    }

    function logout() {
        signOut(auth)
        .then(() => {
            return
        })
        .catch((error) => {
            console.error(error);
        })
    }

    function resetPassword(email) {
        sendPasswordResetEmail(auth, email)
        .then(() => {
            // Password reset email sent!
        })
        .catch((error) => {
            console.error("Unable to send reset email: " + error.code + error.message);
        })
    }

    function updateEmail (email) {
        return currentUser.updateEmail(email)
    }

    function updatePassword (password) {
        return currentUser.updatePassword(password)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user) {
                // User is signed in
                setCurrentUser(user)
            } else {
                // User is signed out
                setCurrentUser(null)
                
            }
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateEmail,
        updatePassword
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
