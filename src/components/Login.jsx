import { useState } from "react";
import "../css/login.css";

// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

//const BACKEND_URI = "http://localhost:5001/api/";
//const BACKEND_URI = "Enter url";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="center-div">
      <div className="yellow-box">
        <div className="notebook"></div>
        <h1 className="text-center">Login Page</h1>
        <form className="form-group">
          <label className="m-2 form-label">Email Id : </label>
          <br />
          <input
            className="m-2 form-control"
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <label className="m-2 form-label">Password : </label>
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
        <div style={{ height: "50px", width: "420px" }}>
          <button
            className="btn btn-primary"
            onClick={(e) => {
              console.log(email);
              console.log(password);
              setEmail("");
              setPassword("");
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
