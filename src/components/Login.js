import React, { useRef, useState } from 'react'
import { goTo, Link } from 'react-chrome-extension-router'
import { useAuth } from '../contexts/AuthContext'
import Signup from './Signup'
import ForgotPassword from './ForgotPassword'
import PrivateRoute from './PrivateRoute'

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    
    const { login } = useAuth()
    const [error, setError] = useState("") 
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value.length < 6) {
            return setError("Password must be at least 6 characters")
        }

        try {
            setError("")    // Reset the error
            setLoading(true)

            await login(emailRef.current.value, passwordRef.current.value)    
            goTo(PrivateRoute)
        } catch {
            setError("Failed to log In")
            console.error(error);
        }
        setLoading(false)
    }
    
    return (
        <div className='component-container'>
            <h1 className='title'>Log In</h1>
            {error && <div className="error"> {error} </div>}
            <form className='form' onSubmit={handleSubmit} autoComplete="off">
                <div className='input-container'>
                    <input className='input' id='email' type='email' ref={emailRef} placeholder='Email'required/>
                </div>
                <div className='input-container'>
                    <input className='input' id='password' type='password' ref={passwordRef} placeholder='Password' required/>
                </div>
                <button className='submit-button' disabled={loading} type="submit">Log In</button>
            </form>
            <Link component={ForgotPassword}>Forgot Password ?</Link>
            <div className='text'>
                Need an account ? <Link component={Signup}>Sign Up</Link>
            </div>
        </div>
    )
}
