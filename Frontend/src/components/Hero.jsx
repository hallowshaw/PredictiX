import React from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import homepageImage from "../assets/homepage.png";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>An AI Multi-Disease Diagnostic Suite</h1>
        <p>
          Revolutionizing Healthcare: Comprehensive, Rapid AI Diagnostics Suite
          for Accurate Multi-Disease Detection and Prevention.
        </p>
        <Link to="/predictors">
          <button className="btn btn-primary">Diagnose Now</button>
        </Link>
      </div>
      <div className="hero-image">
        <img src={homepageImage} alt="AI Multi-Disease Diagnostic Suite" />
      </div>
    </section>
  );
}

export default Hero;
