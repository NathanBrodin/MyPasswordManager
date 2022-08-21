import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ForgotPassword() {
    const emailRef = useRef()
    
    const { resetPassword } = useAuth()
        // eslint-disable-next-line
    const [error, setError] = useState("") 
        // eslint-disable-next-line
    const [message, setMessage] = useState("") 
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        
        try {
            setError("")    // Reset the error
            setMessage("")
            setLoading(true)

            await resetPassword(emailRef.current.value)
            setMessage("Check your inbox for further instructions")
            navigate("/", { replace: true })
        } catch {
            setError("Failed to reset password")
        }
        setLoading(false)
    }
    
    return (
        <div className='component-container'>
            <h1 className='title'>Reset Password</h1>
            <form className='form' onSubmit={handleSubmit}>
                <div className='input-container'>
                    <input className='input' id='email' type='email' ref={emailRef} placeholder='Email' required/>
                </div>
                <button className='submit-button' disabled={loading} type="submit">Reset Password</button>
            </form>
            <div className='text'>
                Need an account ? <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    )
}
