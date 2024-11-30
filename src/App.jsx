import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import MetaModel from "./components/MetaModel";
import React, { useState, useEffect } from 'react';
import Home from "./components/Home";
// import Login from "./components/Login";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Fetching authentication status from the server
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:6001/api/isAuth', {
          method: 'GET',
          credentials: 'include', // Include cookies for session management
        });

        if (response.ok) {
          const userSession = await response.json();
          setIsAuthenticated(true); // Set authenticated to true if successful
          console.log("Authenticated:", userSession);
        } else {
          console.log("Authentication check failed:", response.status);
          setIsAuthenticated(false); // Set authenticated to false if failed
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkAuth();
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true); // Update authentication status on successful login
  };

  const handleLogout = () => {

    fetch("http://localhost:6001/api/logout", {
      method: "GET",
      credentials: "include",
    })
      .then(() => {
        setIsAuthenticated(false);
        console.log("authentication is false");
      })
      .catch((err) => console.log('Logout failed:', err));
  };


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated?<Home onLogout={handleLogout}/>:<Login onLogin={handleLogin}/>} />
        <Route path="/chatInterface" element={<ChatInterface/>}/>
        <Route path="/metamodel" element={<MetaModel />} />
      </Routes>
    </BrowserRouter>
    // <div className="App">
    //   {/* <Login></Login> */}
    //   <ChatBot></ChatBot>
    // </div>
  );
}

export default App;
