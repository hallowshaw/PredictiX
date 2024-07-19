import React, { useState } from "react";
import "../App.css";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { FiUpload } from "react-icons/fi";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const DiabetesPage = () => {
  const [formData, setFormData] = useState({
    pregnancies: "",
    glucose: "",
    bloodPressure: "",
    skinThickness: "",
    insulin: "",
    bmi: "",
    diabetesPedigreeFunction: "",
    age: "",
  });
  const [predictionResult, setPredictionResult] = useState("");
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading spinner

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUploadReport = async (e) => {
    setLoading(true); // Start loading spinner
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      console.log("PDF file uploaded:", file);

      const formData = new FormData();
      formData.append("pdfFile", file);

      try {
        const response = await fetch(
          "http://localhost:8080/api/pdf/diabetes-scraper",
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("PDF upload request failed.");
        }
        const data = await response.json();
        console.log("Data from server:", data);

        setFormData({
          pregnancies: data.Pregnancies || "",
          glucose: data.Glucose || "",
          bloodPressure: data.BloodPressure || "",
          skinThickness: data.SkinThickness || "",
          insulin: data.Insulin || "",
          bmi: data.BMI || "",
          diabetesPedigreeFunction: data.DiabetesPedigreeFunction || "",
          age: data.Age || "",
        });
      } catch (error) {
        console.error("PDF upload failed:", error.message);
        setError("Failed to process PDF. Please try again.");
      } finally {
        setLoading(false); // Stop loading spinner
      }
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/predict/diabetes-pred",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Prediction request failed.");
      }
      const data = await response.json();
      setPredictionResult(data.result);
      setError("");
      setShowResult(true);
    } catch (error) {
      console.error("Prediction failed:", error.message);
      setError("Failed to predict. Please try again.");
      setPredictionResult("");
      setShowResult(false);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const handleRePredict = () => {
    setShowResult(false);
    setPredictionResult("");
    setFormData({
      pregnancies: "",
      glucose: "",
      bloodPressure: "",
      skinThickness: "",
      insulin: "",
      bmi: "",
      diabetesPedigreeFunction: "",
      age: "",
    });
    setPdfFile(null);
  };

  const generateDynamicPDF = async () => {
    try {
      setLoading(true); // Start loading spinner

      const existingPdfBytes = await fetch(
        "/src/ReportTemplate/Report.pdf"
      ).then((res) => res.arrayBuffer());

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      const fields = [
        { label: "Number of Pregnancies:", value: formData.pregnancies },
        { label: "Glucose Level:", value: formData.glucose },
        { label: "Blood Pressure:", value: formData.bloodPressure },
        { label: "Skin Thickness:", value: formData.skinThickness },
        { label: "Insulin:", value: formData.insulin },
        { label: "BMI (Body Index Mass):", value: formData.bmi },
        {
          label: "Diabetes Pedigree Function:",
          value: formData.diabetesPedigreeFunction,
        },
        { label: "Age:", value: formData.age },
        { label: "Prediction Result:", value: predictionResult },
      ];

      let yOffset = height - 250;
      const lineHeight = 20;

      fields.forEach(({ label, value }) => {
        firstPage.drawText(`${label} ${value}`, {
          x: 50,
          y: yOffset,
          size: 12,
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
      link.download = "Diabetes_Pred_Result.pdf";
      link.click();

      setError("");
    } catch (error) {
      console.error("Failed to generate PDF:", error.message);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="diabetes-page-container">
      <h1 className="diabetes-page-header">DIABETES PREDICTOR</h1>
      <div
        className="loader-overlay"
        style={{ display: loading ? "flex" : "none" }}
      >
        <Loader type="TailSpin" color="#FFF" height={70} width={70} />
      </div>
      {!showResult ? (
        <form className="diabetes-page-form" onSubmit={handleSubmit}>
          <div className="diabetes-page-input-container">
            <input
              className="diabetes-page-input"
              type="text"
              name="pregnancies"
              placeholder="Number of Pregnancies"
              value={formData.pregnancies || ""}
              onChange={handleChange}
            />
            <input
              className="diabetes-page-input"
              type="text"
              name="glucose"
              placeholder="Glucose Level"
              value={formData.glucose || ""}
              onChange={handleChange}
            />
            <input
              className="diabetes-page-input"
              type="text"
              name="bloodPressure"
              placeholder="Blood Pressure"
              value={formData.bloodPressure || ""}
              onChange={handleChange}
            />
            <input
              className="diabetes-page-input"
              type="text"
              name="skinThickness"
              placeholder="Skin Thickness"
              value={formData.skinThickness || ""}
              onChange={handleChange}
            />
            <input
              className="diabetes-page-input"
              type="text"
              name="insulin"
              placeholder="Insulin"
              value={formData.insulin || ""}
              onChange={handleChange}
            />
            <input
              className="diabetes-page-input"
              type="text"
              name="bmi"
              placeholder="BMI (Body Index Mass)"
              value={formData.bmi || ""}
              onChange={handleChange}
            />
            <input
              className="diabetes-page-input"
              type="text"
              name="diabetesPedigreeFunction"
              placeholder="Diabetes Pedigree Function"
              value={formData.diabetesPedigreeFunction || ""}
              onChange={handleChange}
            />
            <input
              className="diabetes-page-input"
              type="text"
              name="age"
              placeholder="Age"
              value={formData.age || ""}
              onChange={handleChange}
            />
          </div>
          <div className="diabetes-page-upload-report-container">
            <p>
              Don't want to type manually? Upload your report and we will do it
              for you
            </p>
            <label
              htmlFor="upload-report"
              className="diabetes-page-upload-label"
            >
              <FiUpload className="diabetes-page-upload-icon" /> Upload Report
              <input
                id="upload-report"
                type="file"
                accept="application/pdf"
                onChange={handleUploadReport}
                className="diabetes-page-upload-input"
              />
            </label>
            <button type="submit" className="diabetes-page-button">
              Predict
            </button>
          </div>
        </form>
      ) : (
        <div className="diabetes-page-result-container">
          <p style={{ fontWeight: "bolder", fontSize: "1.5rem" }}>
            Prediction Result:
          </p>
          <p>Number of Pregnancies: {formData.pregnancies}</p>
          <p>Glucose Level: {formData.glucose}</p>
          <p>Blood Pressure: {formData.bloodPressure}</p>
          <p>Skin Thickness: {formData.skinThickness}</p>
          <p>Insulin: {formData.insulin}</p>
          <p>BMI (Body Index Mass): {formData.bmi}</p>
          <p>Diabetes Pedigree Function: {formData.diabetesPedigreeFunction}</p>
          <p>Age: {formData.age}</p>
          <p
            className={`prediction-text ${
              predictionResult.includes("not") ? "no-diabetes" : "diabetes"
            }`}
          >
            {predictionResult}
          </p>
          <button className="diabetes-page-button" onClick={generateDynamicPDF}>
            Download Report
          </button>
          <button className="diabetes-page-button" onClick={handleRePredict}>
            Re-predict
          </button>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default DiabetesPage;
