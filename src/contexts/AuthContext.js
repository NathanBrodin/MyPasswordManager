/* global chrome */
import React, { useContext, createContext, useEffect, useState } from 'react'
import { auth, db } from "../firebase"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail} from "firebase/auth"
import { addDoc, doc, setDoc, collection } from 'firebase/firestore'

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
            createNewUserData(userCrendtial.user)

            return userCrendtial.user
        })
        .catch((error) => {
            // TODO : create error for weak password
            console.error("Unable to create new user : " + error.code + error.message);
        })
    }

    async function createNewUserData(user) {
        try {
            await setDoc(doc(db, "users", user.uid), {
                email: user.email
            })
            await addDoc(collection(db, "users", user.uid, "data"), {

            })
            await addDoc(collection(db, "users", user.uid, "preferences"), {
                autoSubmit: false
            })
        } catch (e) {
            console.error("Error adding new user in database: ", e)
        }
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
            // Log out succesfull
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
            return
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
    
    function saveCurrentUser(currentUser) {
        if(!currentUser) {
            return chrome.storage.sync.set({user: null}, function() {
                console.log('User set to null')
              })
        }

        return chrome.storage.sync.set({user: currentUser.uid}, function() {
            console.log('User set to ' + currentUser.uid)
          })
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            saveCurrentUser(user)
            setCurrentUser(user)
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
