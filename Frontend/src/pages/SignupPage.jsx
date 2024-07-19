import React, { useState, useContext } from "react";
import "../App.css";
import SignupVector from "../assets/SignupVector.png";
import { UserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignupPage() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  async function signup(e) {
    e.preventDefault();

    // Client-side validation
    if (!fullname || !username || !email || !password) {
      toast.error("Please fill out all fields");
      return;
    }

    // Fullname validation (example: must be at least 3 characters)
    if (fullname.length < 3) {
      toast.error("Full name must be at least 3 characters long");
      return;
    }

    // Username validation (example: must be alphanumeric and between 3-20 characters)
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    if (!usernameRegex.test(username)) {
      toast.error(
        "Please enter a valid username (3-20 alphanumeric characters)"
      );
      return;
    }

    // Email format validation including the presence of "@"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Password validation (example: must be at least 6 characters)
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/users/register",
        {
          method: "POST",
          body: JSON.stringify({ fullname, username, email, password }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userInfo = await response.json();
      setUserInfo(userInfo);
      toast.success("Signup successful! Redirecting to homepage...");

      // Delay navigation to show the toast for a few seconds
      setTimeout(() => {
        navigate("/");
      }, 3000); // 3 seconds delay
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <div className="signup-page">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
