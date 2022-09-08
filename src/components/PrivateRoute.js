import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import Dashboard from './Dashboard'
import Login from './Login'

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth()

  return currentUser ? <Dashboard /> : <Login />
}
