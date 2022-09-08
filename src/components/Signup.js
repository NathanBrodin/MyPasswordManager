import React, { useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { goTo, Link } from 'react-chrome-extension-router'
import Login from './Login'
import PrivateRoute from './PrivateRoute'

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    
    const { signup } = useAuth()
        // eslint-disable-next-line
    const [error, setError] = useState("") 
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Password do not match")
        }
        
        try {
            setError("")    // Reset the error
            setLoading(true)

            await signup(emailRef.current.value, passwordRef.current.value)
            goTo(PrivateRoute)
        } catch {
            setError("Failed to create an account")
        }
        setLoading(false)
    }
    
    return (
        <div className='component-container'>
            <h1 className='title'>Sign Up</h1>
            <form className='form' onSubmit={handleSubmit}>
                <div className='input-container'>
                    <input className='input' id='email' type='email' ref={emailRef} placeholder='Email' required/>
                </div>
                <div className='input-container'>
                    <input className='input' id='password' type='password' ref={passwordRef} placeholder='Password' required
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                    title="Must contain at least one  number and one uppercase and lowercase letter, and at least 6 or more characters"/>
                </div>
                <div className='input-container'>
                    <input className='input' id='password' type='password' ref={passwordConfirmRef} placeholder='Confirm password' required
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                    title="Must contain at least one  number and one uppercase and lowercase letter, and at least 6 or more characters"/>
                </div>
                <button className='submit-button' disabled={loading} type="submit">Sign Up</button>
            </form>
            <div className='text'>
                Already have an account? <Link component={Login}>Log In</Link>
            </div>
        </div>
    )
}
