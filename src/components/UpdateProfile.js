import React, { useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { useHistory } from "react-dom"

export default function UpdateProfile() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    
    const { currentUser, updateEmail, updatePassword } = useAuth()
    const [error, setError] = useState("") 
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Password do not match")
        }

        const promises = []
        setError("")    // Reset the error
        setLoading(true)

        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }
        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        Promise.all(promises).then (() => {
            history.push("/")
        }).catch(() => {
            setError("Failed to update account")
        }).finally(() => {
            setError("")    // Reset the error
            setLoading(false)
        })
    }
    
    return (
        <div className='Signup'>
            <div>
                <h3>Update Profile</h3>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder='Email' ref={emailRef} required defaultValue={currentUser.email}/>
                    <input type="password" placeholder='Leave blank to keep the same' ref={passwordRef} required/>
                    <input type="password" placeholder='Leave blank to keep the same' ref={passwordConfirmRef} required/>
    
                    <button disabled={loading} type="submit"> Update</button>
                    
                    <div>
                        <Link to="/">Cancel</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
