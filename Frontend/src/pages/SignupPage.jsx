import React, { useState, useContext } from "react";
import "../App.css";
import LoginVector from "../assets/LoginVector.png";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  const navigate = useNavigate();

  async function signup(e) {
    e.preventDefault();
    console.log(fullname);
    console.log(username);
    console.log(password);
    const response = await fetch(
      "http://localhost:8080/api/v1/users/register",
      {
        method: "POST",
        body: JSON.stringify({ fullname, username, email, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    console.log(response);
    if (response.ok) {
      response.json().then((userInfo) => {
        console.log(userInfo);
        setUserInfo(userInfo);
        setRedirect(true);
      });
      setRedirect(true);
    } else {
      alert("Wrong credentials");
    }
  }

  if (redirect) {
    navigate("/");
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-container">
          <h2 className="login-title">Sign Up</h2>
          <form className="login-form" onSubmit={signup}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
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
              Sign Up
            </button>
          </form>
        </div>
        <div className="login-image">
          <img src={LoginVector} alt="Login Vector" />
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
