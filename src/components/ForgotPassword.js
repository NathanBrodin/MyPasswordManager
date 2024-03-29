import React, { useRef, useState } from 'react'
import { goTo, Link } from 'react-chrome-extension-router'
import { useAuth } from '../contexts/AuthContext'
import PrivateRoute from './PrivateRoute'
import Signup from './Signup'

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState("") 
        // eslint-disable-next-line
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        
        try {
            setError("")    // Reset the error
            setLoading(true)

            await resetPassword(emailRef.current.value)
            setError("Check your inbox for further instructions")
            goTo(PrivateRoute)
        } catch {
            setError("Failed to reset password")
        }
        setLoading(false)
    }
    
    return (
        <div className='component-container'>
            <h1 className='title'>Reset Password</h1>
            {error && <div className="error"> {error} </div>}
            <form className='form' onSubmit={handleSubmit} autoComplete="off">
                <div className='input-container'>
                    <input className='input' id='email' type='email' ref={emailRef} placeholder='Email' required/>
                </div>
                <button className='submit-button' disabled={loading} type="submit">Reset Password</button>
            </form>
            <div className='text'>
                Need an account ? <Link component={Signup}>Sign Up</Link>
            </div>
        </div>
    )
}
