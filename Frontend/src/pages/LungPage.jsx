import React, { useState } from "react";
import "../App.css";
import { FiUpload } from "react-icons/fi";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import Loader from "react-loader-spinner"; // Import the loader component
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"; // Import the loader styles

const LungPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
  });
  const [predictionResult, setPredictionResult] = useState("");
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false); // State to track image upload

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImageUploaded(true); // Set imageUploaded to true
      setError("");
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError("Please upload an image file.");
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("image", imageFile);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("gender", formData.gender);

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/predict/lung-pred",
        {
          method: "POST",
          body: formDataToSend,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Prediction request failed.");
      }

      const data = await response.json();

      if (data.prediction) {
        setPredictionResult(data.prediction);
        setError("");
        setShowResult(true);
      } else {
        throw new Error("Prediction failed.");
      }
    } catch (error) {
      console.error("Prediction failed:", error.message);
      setError("Failed to predict. Please try again.");
      setPredictionResult("");
      setShowResult(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRePredict = () => {
    setShowResult(false);
    setPredictionResult("");
    setFormData({
      name: "",
      age: "",
      gender: "",
    });
    setImageFile(null);
    setImageUploaded(false); // Reset imageUploaded state
  };

  const generateDynamicPDF = async () => {
    try {
      const existingPdfBytes = await fetch(
        "/src/ReportTemplate/Report.pdf"
      ).then((res) => res.arrayBuffer());

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      const fields = [
        { label: "Name:", value: formData.name, size: 14 },
        { label: "Age:", value: formData.age, size: 14 },
        { label: "Gender:", value: formData.gender, size: 14 },
        { label: "Prediction Result:", value: predictionResult, size: 16 },
      ];

      let yOffset = height - 250;
      const lineHeight = 24;

      fields.forEach(({ label, value, size }) => {
        firstPage.drawText(`${label} ${value}`, {
          x: 50,
          y: yOffset,
          size: size,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        yOffset -= lineHeight;
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "lung_disease_report.pdf";
      link.click();

      setError("");
    } catch (error) {
      console.error("Failed to generate PDF:", error.message);
      setError("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="lung-page-container">
      <h1 className="lung-page-header">LUNG DISEASE PREDICTOR</h1>
      <div
        className="loader-overlay"
        style={{ display: loading ? "flex" : "none" }}
      >
        <Loader type="TailSpin" color="#FFF" height={70} width={70} />
      </div>
      {!showResult ? (
        <form className="lung-page-form" onSubmit={handleSubmit}>
          <div className="lung-page-input-container">
            <input
              className="lung-page-input"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              className="lung-page-input"
              type="text"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
            />
            <select
              className="lung-page-input"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div className="lung-page-upload-image-container">
            <p>Upload your C.T Scanned image of Lungs for prediction</p>
            <label htmlFor="upload-image" className="lung-page-upload-label">
              <FiUpload className="lung-page-upload-icon" /> Upload Image
              {imageUploaded && (
                <span style={{ marginLeft: "0.5rem", color: "green" }}>✔</span>
              )}
              <input
                id="upload-image"
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
                className="lung-page-upload-input"
                required
              />
            </label>
            <button
              type="submit"
              className="lung-page-button"
              disabled={loading}
            >
              Predict
            </button>
          </div>
        </form>
      ) : (
        <div className="lung-page-result-container">
          <p style={{ fontWeight: "bolder", fontSize: "1.5rem" }}>
            Prediction Result:
          </p>
          <p>Name: {formData.name}</p>
          <p>Age: {formData.age}</p>
          <p>Gender: {formData.gender === "M" ? "Male" : "Female"}</p>
          <p
            className={`prediction-text ${
              predictionResult.includes("not suffering")
                ? "no-lung-disease"
                : "lung-disease"
            }`}
          >
            {predictionResult}
          </p>
          <div className="lung-page-buttons-container">
            <button className="lung-page-button" onClick={handleRePredict}>
              Re-predict
            </button>
            <button className="lung-page-button" onClick={generateDynamicPDF}>
              Download Report
            </button>
          </div>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default LungPage;
