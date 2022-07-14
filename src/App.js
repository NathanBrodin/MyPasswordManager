import React from "react"
import Dashboard from "./components/Dashboard"
import Signup from "./components/Signup"
import Login from "./components/Login"
import ForgotPassword from "./components/ForgotPassword"
import UpdateProfile from "./components/UpdateProfile"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router } from "react-router-dom"
import { Switch, Route } from "react-dom"
import PrivateRoute from "./components/PrivateRoute"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard}/>
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <PrivateRoute path="/update-profile" component={UpdateProfile} />
        </Switch>
      </AuthProvider>
    </Router>
  )
}

export default App;
