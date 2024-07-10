import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/PredictiX_main_logo.png";

function Navbar() {
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
      </div>
      <div className="navbar-auth">
        <NavLink to="/login" className="btn btn-login">
          Log In
        </NavLink>
        <NavLink to="/signup" className="btn btn-signup">
          Sign Up
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
