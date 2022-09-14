/* global chrome */
import React, { useContext, createContext, useEffect, useState } from 'react'
import CryptoJS from 'crypto-js'
import { auth, db } from "../firebase"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail} from "firebase/auth"
import { addDoc, doc, setDoc, updateDoc, getDoc, collection } from 'firebase/firestore'

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
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
                email: user.email,
                autoSubmit: false
            })
            await addDoc(collection(db, "users", user.uid, "data"), {

            })
        } catch (e) {
            console.error("Error adding new user in database: ", e)
        }

    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth)
        .then(() => {
            // Log out succesfull
            return
        })
        .catch((error) => {
            console.error(error);
        })
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
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

    async function getAutoSubmit() {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().autoSubmit
        } else {
            return false
        }
    }

    async function updateAutoSubmit (autoSubmit) {
        try {
            await updateDoc(doc(db, "users", currentUser.uid), {
                autoSubmit: autoSubmit
            })
        } catch (e) {
            console.error("Error updating autoSubmit in database: ", e)
        }
    }
    
    function saveCurrentUser(currentUser) {
        if(!currentUser) {
            return chrome.storage.sync.set({user: null}, function() {
                console.log('User set to null')
              })
        }

        chrome.storage.sync.set({key: generateSecretKey()}, function() {
            console.log('Secret key generated')
          })

        return chrome.storage.sync.set({user: currentUser.uid}, function() {
            console.log('User set to ' + currentUser.uid)
          })

        
    }

    function generateSecretKey() {
        return CryptoJS.lib.WordArray.random(128/8).toString()
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            saveCurrentUser(user)
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        getAutoSubmit,
        updateAutoSubmit
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
