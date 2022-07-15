import React from "react"
import Dashboard from "./components/Dashboard"
import Signup from "./components/Signup"
import Login from "./components/Login"
import ForgotPassword from "./components/ForgotPassword"
import UpdateProfile from "./components/UpdateProfile"
import { AuthProvider } from "./contexts/AuthContext"
import { HashRouter as Router, Route, Routes } from "react-router-dom"
import PrivateRoute from "./components/PrivateRoute"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<PrivateRoute> <Dashboard /> </PrivateRoute> } />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route exact path="/update-profile" element={<PrivateRoute> <UpdateProfile /> </PrivateRoute> } />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App;
