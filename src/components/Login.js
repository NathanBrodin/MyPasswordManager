import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    
    const { login } = useAuth()
    const [error, setError] = useState("") 
    const [loading, setLoading] = useState(false)
    let navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        
        try {
            setError("")    // Reset the error
            setLoading(true)

            await login(emailRef.current.value, passwordRef.current.value)    
            navigate("/")
        } catch {
            setError("Failed to log In")
            console.error(error);
        }
        setLoading(false)
    }
    
    return (
        <div className='Signup'>
            <div>
                <h3>Log In</h3>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder='Email' ref={emailRef} required/>
                    <input type="password" placeholder='Password' ref={passwordRef} required/>
                    <Link to="/forgot-password">Forgot Password ?</Link>
                    <button disabled={loading} type="submit">Log In</button>
                </form>
                <div>
                        Need an account? <Link to="/signup">Sign Up</Link>
                    </div>
            </div>
        </div>
    )
}
