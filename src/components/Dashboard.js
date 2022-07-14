import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { useHistory } from "react-dom"

export default function Dashboard() {
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError("")

        try {
            await logout()
            history.pushState("/login")
        } catch {
            setError("Failed to log out")
        }
    }

  return (
    <div>
        <h3>Profile</h3>
        <strong>Email: </strong>{currentUser.email}
        <Link to="/update-profile">Update Profile</Link>
        <button onClick={handleLogout}>Log Out</button>
    </div>
  )
}
