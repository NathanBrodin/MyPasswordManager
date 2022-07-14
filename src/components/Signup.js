import React, { useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();

    const { signup } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Password do not match");
        }

        try {
            setError("");   // Reset the error
            setLoading(true);

            await signup(emailRef.current.value, passwordRef.current.value);
        } catch {
            setError("Failed to create an account");
        }
        setLoading(false);
    }

    return (
        <div className='Signup'>
            <div>
                <h3> Sign Up</h3>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder='Email' ref={emailRef} required/>
                    <input type="password" placeholder='Password' ref={passwordRef} required/>
                    <input type="password" placeholder='Confirm password' ref={passwordConfirmRef} required/>
    
                    <button disabled={loading} type="submit"> Sign up</button>
                    
                    <div>Already have an account? Log In</div>
                </form>
            </div>
        </div>
    )
}
