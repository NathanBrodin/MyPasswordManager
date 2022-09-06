import React from 'react'
import { Router } from 'react-chrome-extension-router'
import { useAuth } from '../contexts/AuthContext'
import Login from './Login'

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth()

  return currentUser ? children : <Router component={Login} />
}
