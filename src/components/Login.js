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
        <div className='component-container'>
            <h1 className='title'>Log In</h1>
            <form className='form' onSubmit={handleSubmit}>
                <div className='input-container'>
                    <input className='input' id='email' type='email' ref={emailRef} placeholder='Email' autoComplete='off' required/>
                </div>
                <div className='input-container'>
                    <input className='input' id='password' type='password' ref={passwordRef} placeholder='Password' required
                    pattern=".{6,}"
                    title="Must contain at least one  number and one uppercase and lowercase letter, and at least 6 or more characters"/>
                </div>
                <button className='submit-button' disabled={loading} type="submit">Log In</button>
            </form>
            <Link to="/forgot-password">Forgot Password ?</Link>
            <div className='text'>
                Need an account ? <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    )
}
