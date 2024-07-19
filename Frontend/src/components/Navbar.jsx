import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Import FaTimes for the cross icon
import logo from "../assets/PredictiX_main_logo.png";
import { UserContext } from "../context/UserContext";

function Navbar() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [isMobile, setIsMobile] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobile(!isMobile);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsMobile(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="PredictiX" />
      </div>
      <div className={`navbar-links ${isMobile ? "mobile active" : ""}`}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={handleLinkClick} // Close the menu on click
        >
          Home
        </NavLink>
        <NavLink
          to="/predictors"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={handleLinkClick} // Close the menu on click
        >
          Predictors
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={handleLinkClick} // Close the menu on click
        >
          About us
        </NavLink>
        {isLoggedIn ? (
          <div className={`navbar-auth ${isMobile ? "mobile" : ""}`}>
            <span
              style={{
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              Hello, {userInfo.data.username}
            </span>
            <NavLink
              to="/"
              onClick={logout}
              className="btn btn-logout" // Use a custom class for logout button
              style={{ cursor: "pointer" }}
            >
              Logout
            </NavLink>
          </div>
        ) : (
          <div className={`navbar-auth ${isMobile ? "mobile" : ""}`}>
            <NavLink
              to="/login"
              className="btn btn-login"
              onClick={handleLinkClick} // Close the menu on click
            >
              Log In
            </NavLink>
            <NavLink
              to="/signup"
              className="btn btn-signup"
              onClick={handleLinkClick} // Close the menu on click
            >
              Sign Up
            </NavLink>
          </div>
        )}
      </div>
      <div className="hamburger" onClick={toggleMobileMenu}>
        {isMobile ? <FaTimes size={30} /> : <FaBars size={30} />}{" "}
        {/* Toggle icon */}
      </div>
    </nav>
  );
}

export default Navbar;
