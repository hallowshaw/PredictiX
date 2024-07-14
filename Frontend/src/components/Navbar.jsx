import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/PredictiX_main_logo.png";
import { UserContext } from "../context/UserContext";

function Navbar() {
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/users/profile",
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setUserInfo(null);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/users/logout",
        {
          credentials: "include",
          method: "POST",
        }
      );
      if (response.ok) {
        setUserInfo(null);
      } else {
        console.error("Logout failed with status:", response.status);
      }
    } catch (error) {
      console.error("Logout failed with error:", error);
    }
  };

  const isLoggedIn = userInfo?.data?.username;

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="PredictX" />
      </div>
      <div className="navbar-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/predictors"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Predictors
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          About us
        </NavLink>
        {isLoggedIn ? (
          <div className="navbar-auth">
            <span>Hello, {userInfo.data.username}</span>
            <NavLink
              to="/"
              onClick={logout}
              className="navbar-link"
              style={{ cursor: "pointer" }}
            >
              Logout
            </NavLink>
          </div>
        ) : (
          <div className="navbar-auth">
            <NavLink to="/login" className="btn btn-login">
              Log In
            </NavLink>
            <NavLink to="/signup" className="btn btn-signup">
              Sign Up
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
