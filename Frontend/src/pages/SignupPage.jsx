import React, { useState, useContext } from "react";
import "../App.css"; // Ensure this imports the new CSS file for signup
import SignupVector from "../assets/SignupVector.png";
import { UserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";

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
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-form-container">
          <h2 className="signup-title">Sign Up</h2>
          <form className="signup-form" onSubmit={signup}>
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
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>
          <div className="signup-footer">
            <p>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
        <div className="signup-image">
          <img src={SignupVector} alt="Signup Vector" />
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
