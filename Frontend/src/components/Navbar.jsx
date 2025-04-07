import React, { useContext, useEffect, useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Import FaTimes for the cross icon
import logo from "../assets/PredictiX_main_logo.png";
import { UserContext } from "../context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Navbar() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();

    const handleResize = () => {
      if (window.innerWidth > 954 && isMobile) {
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

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
        toast.success("You have been logged out successfully!", {
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="navbar-logo">
        <img src={logo} alt="PredictiX" />
      </div>
      <div className={`navbar-links ${isMobile ? "mobile active" : ""}`}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={handleLinkClick}
        >
          Home
        </NavLink>
        <NavLink
          to="/predictors"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={handleLinkClick}
        >
          Predictors
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
          onClick={handleLinkClick}
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
              className="btn btn-logout"
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
              onClick={handleLinkClick}
            >
              Log In
            </NavLink>
            <NavLink
              to="/signup"
              className="btn btn-signup"
              onClick={handleLinkClick}
            >
              Sign Up
            </NavLink>
          </div>
        )}
      </div>
      <div className="hamburger" onClick={toggleMobileMenu}>
        {isMobile ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>
    </nav>
  );
}

export default Navbar;
