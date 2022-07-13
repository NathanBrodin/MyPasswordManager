import React from "react";
import Signup from "./components/Signup";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Signup />
    </AuthProvider>
  )
}

export default App;
