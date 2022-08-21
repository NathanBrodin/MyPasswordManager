import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Dashboard() {
        // eslint-disable-next-line
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()

    async function handleLogout() {
        setError("")

        try {
            await logout()
            navigate("/login")
        } catch {
            setError("Failed to log out")
        }
    }

  return (
    <div className='component-container'>
            <h1 className='title'>Profile</h1>
            <strong>Email: </strong>{currentUser.email}
            <Link to="/update-profile">Update Profile</Link>
            <button className='submit-button' onClick={handleLogout}>Log Out</button>           
        </div>
  )
}
