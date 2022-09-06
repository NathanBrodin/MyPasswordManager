import React, { useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { goTo, Link } from 'react-chrome-extension-router'
import Dashboard from './Dashboard'

export default function UpdateProfile() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    
    const { currentUser, updateEmail, updatePassword } = useAuth()
    // eslint-disable-next-line
    const [error, setError] = useState("") 
    const [loading, setLoading] = useState(false)

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
            goTo(Dashboard)
        }).catch(() => {
            setError("Failed to update account")
        }).finally(() => {
            setError("")    // Reset the error
            setLoading(false)
        })
    }
    
    return (
        <div className='component-container'>
            <h1 className='title'>Update Profile</h1>
            <form className='form' onSubmit={handleSubmit}>
                <div className='input-container'>
                    <input className='input' id='email' type='email' ref={emailRef} placeholder='Email' required defaultValue={currentUser.email}/>
                </div>
                <div className='input-container'>
                    <input className='input' id='password' type='password' ref={passwordRef} placeholder='Password' required
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                    title="Must contain at least one  number and one uppercase and lowercase letter, and at least 6 or more characters"/>
                </div>
                <div className='input-container'>
                    <input className='input' id='password' type='password' ref={passwordConfirmRef} placeholder='Confirm Password' required
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                    title="Must contain at least one  number and one uppercase and lowercase letter, and at least 6 or more characters"/>
                </div>
                <button className='submit-button' disabled={loading} type="submit">Update</button>
            </form>
            <div className='text'>
                <Link component={Dashboard}>Cancel</Link>
            </div>
        </div>
    )
}
