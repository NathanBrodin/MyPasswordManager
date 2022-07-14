import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from "react-dom"
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    
    const { login } = useAuth()
    const [error, setError] = useState("") 
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()
        
        try {
            setError("")    // Reset the error
            setLoading(true)

            await login(emailRef.current.value, passwordRef.current.value)
            history.push("/")
        } catch {
            setError("Failed to sign In")
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
                    <button disabled={loading} type="submit">Log In</button>
                    
                    <div>
                        Need an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
