import React from "react"
import Dashboard from "./components/Dashboard"
import { AuthProvider } from "./contexts/AuthContext"
//import { HashRouter as Router, Route, Routes } from "react-router-dom"
import { Router } from "react-chrome-extension-router"
import PrivateRoute from "./components/PrivateRoute"
import './App.css'
import Login from "./components/Login"
import Signup from "./components/Signup"

function App() {
  return (
    <AuthProvider>
      <Router>
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      </Router>
    </AuthProvider>

    /*
    <Router>
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<PrivateRoute> <Dashboard /> </PrivateRoute> } />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route exact path="/update-profile" element={<PrivateRoute> <UpdateProfile /> </PrivateRoute> } />
        </Routes>
      </AuthProvider>
    </Router>
    */
  )
}

export default App;
