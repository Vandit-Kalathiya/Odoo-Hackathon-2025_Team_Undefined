import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "contexts/AppProvider";

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
