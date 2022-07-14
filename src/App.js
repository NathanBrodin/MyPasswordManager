import React from "react"
import Dashboard from "./components/Dashboard"
import Signup from "./components/Signup"
import Login from "./components/Login"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router } from "react-router-dom"
import { Switch, Route } from "react-dom"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route exact path="/" component={Dashboard}/>
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
        </Switch>
      </AuthProvider>
    </Router>
  )
}

export default App;
