import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import "../css/login.css";

// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

//const BACKEND_URI = "http://localhost:5001/api/";
//const BACKEND_URI = "Enter url";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
        try {
            const response = await fetch('http://localhost:6001/api/isAuth', {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                navigate('/chatbot');
            } else {
                const errorData = await response.text(); // Get the raw text to see the error
                console.log('User is not authenticated:', errorData);
            }
        } catch (error) {
            console.log(error);
            setError('An error occurred during Authentication');
        }
    }
    checkAuth();
}, [navigate]);

const handleLogin = async (e) => {
  e.preventDefault();
  if (!email || !password) {
      setError('Please enter both email and password');
      return;
  }
  try {
      const response = await fetch('http://localhost:6001/api/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
              email,
              password,
          }),
      });

      const data = await response.json();

      if (response.ok) {
          setError('');
          alert("Login successful!");
          onLogin();
          navigate('/chatbot');
      } else {
          setError(data.msg || 'Login failed');
      }
  } catch (err) {
      console.error(err);
      setError('An error occurred during login');
  }
};

  return (
    <div className="center-div">
      <div className="yellow-box">
        <div className="notebook"></div>
        <h1 className="text-center">Login Page</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form className="form-group">
          <label className="m-2 form-label" htmlFor='email'>Email Id : </label>
          <br />
          <input
            className="m-2 form-control"
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <label className="m-2 form-label" htmlFor='password'>Password : </label>
          <br />
          <input
            className="m-2 form-control"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </form>
        <br />
        <div
          className="button-container"
          style={{ height: "50px", width: "420px" }}
        >
          <button
            className="btn btn-primary"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

// Add PropTypes validation
Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
