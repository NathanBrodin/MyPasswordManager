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
        <div className='Login'>
            <div>
                <h3>Log In</h3>
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input type="email" ref={emailRef} required/>
                    <label>Password</label>
                    <input type="password" ref={passwordRef} required/>
                    <button disabled={loading} type="submit">Log In</button>
                </form>
                <Link to="/forgot-password">Forgot Password ?</Link>
                <div>
                        Need an account? <Link to="/signup">Sign Up</Link>
                    </div>
            </div>
        </div>
    )
}
