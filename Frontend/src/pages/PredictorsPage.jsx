import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import heartImage from "../assets/heart.png";
import lungImage from "../assets/lung.png";
import diabetesImage from "../assets/diabetes.png";
import breastImage from "../assets/breast.png";
import "../App.css";

function PredictorsPage() {
  return (
    <div className="predictor-container">
      <p className="description">
        The Comprehensive Health Diagnostics Suite utilizes advanced AI
        technology for early detection and precise prediction of breast cancer,
        lung cancer, heart disease, and diabetes. By leveraging sophisticated
        algorithms and extensive datasets, our system identifies these
        conditions early, enabling timely interventions and personalized
        treatments. Our mission is to transform healthcare into a predictive and
        personalized experience, fostering a healthier future for all by
        reducing the burden of these diseases and enhancing quality of life.
      </p>
      <div className="card-container">
        <Link
          to="/predictors/heart"
          className="card"
          style={{ textDecoration: "none" }}
        >
          <Card
            image={heartImage}
            title="Heart Disease"
            description="Guarding Hearts: AI solutions for accurate prediction and early intervention in heart disease."
          />
        </Link>
        <Link
          to="/predictors/lung"
          className="card"
          style={{ textDecoration: "none" }}
        >
          <Card
            image={lungImage}
            title="Lung Cancer"
            description="Clearing the Air: AI-driven insights for proactive lung cancer prediction and care."
          />
        </Link>
        <Link
          to="/predictors/breast"
          className="card"
          style={{ textDecoration: "none" }}
        >
          <Card
            image={breastImage}
            title="Breast Cancer"
            description="Beyond Detection: AI innovation for early, precise breast cancer prediction and care."
          />
        </Link>
        <Link
          to="/predictors/diabetes"
          className="card"
          style={{ textDecoration: "none" }}
        >
          <Card
            image={diabetesImage}
            title="Diabetes"
            description="Empowering Health: AI solutions for precise diabetes prediction and proactive wellness."
          />
        </Link>
      </div>
    </div>
  );
}

export default PredictorsPage;
