import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ChatBot from "./components/ChatBot";
import MetaModel from "./components/MetaModel";
<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
import Home from "./components/Home";
=======
import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import AdmitHome from "./components/Admit_Home";
import AboutUs from "./components/AboutUs";
>>>>>>> Stashed changes
// import Login from "./components/Login";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Fetching authentication status from the server
  useEffect(() => {
    const checkAuth = async () => {
      try {
<<<<<<< Updated upstream
        const response = await fetch('http://localhost:6001/api/isAuth', {
          method: 'GET',
          credentials: 'include', // Include cookies for session management
=======
        const response = await fetch("http://localhost:6001/api/isAuth", {
          method: "GET",
          credentials: "include", // Include cookies for session management
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    fetch('http://localhost:6001/api/logout', {
      method: 'GET',
      credentials: 'include',
=======
    fetch("http://localhost:6001/api/logout", {
      method: "GET",
      credentials: "include",
>>>>>>> Stashed changes
    })
      .then(() => {
        setIsAuthenticated(false);
        console.log("authentication is false");
      })
<<<<<<< Updated upstream
      .catch((err) => console.log('Logout failed:', err));
  };


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated?<Home onLogout={handleLogout}/>:<Login onLogin={handleLogin}/>} />
=======
      .catch((err) => console.log("Logout failed:", err));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home onLogout={handleLogin} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
>>>>>>> Stashed changes
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/metamodel" element={<MetaModel />} />
        <Route path="/admin_home" element={<AdmitHome />} />
        <Route path="/aboutus" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
    // <div className="App">
    //   {/* <Login></Login> */}
    //   <ChatBot></ChatBot>
    // </div>
  );
}

export default App;
