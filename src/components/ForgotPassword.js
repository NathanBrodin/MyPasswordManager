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
        <div className='Signup'>
            <div>
                <h3>Password Reset</h3>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder='Email' ref={emailRef} required/>
                    <button disabled={loading} type="submit">Reset Password</button>
                    
                    <Link to="/login">Log In</Link>
                    <div>
                        Need an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
