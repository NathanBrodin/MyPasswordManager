import React from "react"
import Dashboard from "./components/Dashboard"
import { AuthProvider } from "./contexts/AuthContext"
import { Router } from "react-chrome-extension-router"
import PrivateRoute from "./components/PrivateRoute"
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      </Router>
    </AuthProvider>
  )
}

export default App;
