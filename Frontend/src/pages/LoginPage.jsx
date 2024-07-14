import React, { useState, useContext } from "react";
import "../App.css";
import LoginVector from "../assets/LoginVector.png";
import { UserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom"; // Import Link from react-router-dom

function LoginPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userInfo = await response.json();
      setUserInfo(userInfo);
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("Wrong credentials");
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-container">
          <h2 className="login-title">Log In</h2>
          <form className="login-form" onSubmit={login}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="login-button">
              Log In
            </button>
          </form>
          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
        <div className="login-image">
          <img src={LoginVector} alt="Login Vector" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
