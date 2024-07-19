import React, { useState } from "react";
import "../App.css";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"; // Ensure correct import
import { FiUpload } from "react-icons/fi"; // Importing React Icons
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const HeartPage = () => {
  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    chestPainType: "",
    restingBloodPressure: "",
    serumCholesterol: "",
    fastingBloodSugar: "",
    restingECG: "",
    maxHeartRate: "",
    exerciseInducedAngina: "",
    oldPeak: "",
    slope: "",
    numMajorVessels: "",
    thal: "",
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
          "http://localhost:8080/api/pdf/heart-scraper",
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
        console.log("Data from server:", data); // Debug log to see the data structure

        // Map the response data to the form state
        setFormData({
          age: data.Age || "",
          sex: data.Sex || "",
          chestPainType: data["Chest pain type"] || "",
          restingBloodPressure: data["Resting blood pressure"] || "",
          serumCholesterol: data["Serum cholesterol in mg/dl"] || "",
          fastingBloodSugar:
            data["Fasting blood sugar > 120 mg/dl"] === "Yes" ? "1" : "0",
          restingECG: data["Resting Electrocardiographic Results"] || "",
          maxHeartRate: data["Maximum Heart Rate Achieved"] || "",
          exerciseInducedAngina: data["Exercise Induced Angina"] || "",
          oldPeak: data["Old peak"] || "",
          slope: data["Slope of the peak exercise ST Segment"] || "",
          numMajorVessels:
            data["Number of major vessels (0-3) colored by fluoroscopy"] || "",
          thal: data["Thal (Thallium Stress Test Result)"] || "",
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
        "http://localhost:8080/api/v1/predict/heart-pred",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            p1: formData.age,
            p2: formData.sex,
            p3: formData.chestPainType,
            p4: formData.restingBloodPressure,
            p5: formData.serumCholesterol,
            p6: formData.fastingBloodSugar,
            p7: formData.restingECG,
            p8: formData.maxHeartRate,
            p9: formData.exerciseInducedAngina,
            p10: formData.oldPeak,
            p11: formData.slope,
            p12: formData.numMajorVessels,
            p13: formData.thal,
          }),
          credentials: "include", // Ensure cookies are sent
        }
      );
      if (!response.ok) {
        throw new Error("Prediction request failed.");
      }
      const data = await response.json();
      setPredictionResult(data.result);
      setError(""); // Clear any previous errors
      setShowResult(true); // Show the result section
    } catch (error) {
      console.error("Prediction failed:", error.message);
      setError("Failed to predict. Please try again.");
      setPredictionResult(""); // Reset prediction result on error
      setShowResult(false); // Hide the result section
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const handleRePredict = () => {
    setShowResult(false); // Hide the result section to show the form again
    setPredictionResult(""); // Clear the prediction result
    setFormData({
      age: "",
      sex: "",
      chestPainType: "",
      restingBloodPressure: "",
      serumCholesterol: "",
      fastingBloodSugar: "",
      restingECG: "",
      maxHeartRate: "",
      exerciseInducedAngina: "",
      oldPeak: "",
      slope: "",
      numMajorVessels: "",
      thal: "",
    }); // Reset form fields
    setPdfFile(null); // Reset PDF file
  };

  // Function to generate and download PDF with dynamic data
  const generateDynamicPDF = async () => {
    setLoading(true); // Start loading spinner
    try {
      const existingPdfBytes = await fetch(
        "/src/ReportTemplate/Report.pdf"
      ).then((res) => res.arrayBuffer());

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      // Draw each field from formData onto the PDF
      const fields = [
        { label: "Age:", value: formData.age },
        { label: "Sex:", value: formData.sex },
        { label: "Chest Pain Type:", value: formData.chestPainType },
        {
          label: "Resting Blood Pressure:",
          value: formData.restingBloodPressure,
        },
        { label: "Serum Cholesterol:", value: formData.serumCholesterol },
        { label: "Fasting Blood Sugar:", value: formData.fastingBloodSugar },
        { label: "Resting ECG:", value: formData.restingECG },
        {
          label: "Maximum Heart Rate Achieved:",
          value: formData.maxHeartRate,
        },
        {
          label: "Exercise Induced Angina:",
          value: formData.exerciseInducedAngina,
        },
        { label: "Old Peak:", value: formData.oldPeak },
        { label: "Slope:", value: formData.slope },
        {
          label: "Number of Major Vessels (0-3):",
          value: formData.numMajorVessels,
        },
        { label: "Thal:", value: formData.thal },
        { label: "Prediction Result:", value: predictionResult },
      ];

      let yOffset = height - 250; // Starting Y position with more spacing
      const lineHeight = 20; // Line height between fields

      fields.forEach(({ label, value }) => {
        firstPage.drawText(`${label} ${value}`, {
          x: 50,
          y: yOffset,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        yOffset -= lineHeight; // Move Y position up for the next line
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Heart_Disease_Pred_Result.pdf";
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
    <div className="heart-page-container">
      <h1 className="heart-page-header">HEART DISEASE PREDICTOR</h1>
      <div
        className="loader-overlay"
        style={{ display: loading ? "flex" : "none" }}
      >
        <Loader type="TailSpin" color="#FFF" height={70} width={70} />
      </div>
      {!showResult ? (
        <form className="heart-page-form" onSubmit={handleSubmit}>
          <div className="heart-page-input-container">
            <input
              className="heart-page-input"
              type="text"
              name="age"
              placeholder="Age"
              value={formData.age || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="sex"
              placeholder="Sex (0 - female, 1 - male)"
              value={formData.sex || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="chestPainType"
              placeholder="Chest Pain Type (1-Typical Angina, 2-Atypical Angina, 3-Non-anginal Pain,4-Asymptomatic)"
              value={formData.chestPainType || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="restingBloodPressure"
              placeholder="Resting Blood Pressure"
              value={formData.restingBloodPressure || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="serumCholesterol"
              placeholder="Serum Cholesterol"
              value={formData.serumCholesterol || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="fastingBloodSugar"
              placeholder="Fasting Blood Sugar (0 or 1)"
              value={formData.fastingBloodSugar || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="restingECG"
              placeholder="Resting ECG"
              value={formData.restingECG || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="maxHeartRate"
              placeholder="Maximum Heart Rate Achieved"
              value={formData.maxHeartRate || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="exerciseInducedAngina"
              placeholder="Exercise Induced Angina (0 or 1)"
              value={formData.exerciseInducedAngina || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="oldPeak"
              placeholder="Old Peak"
              value={formData.oldPeak || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="slope"
              placeholder="Slope"
              value={formData.slope || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="numMajorVessels"
              placeholder="Number of Major Vessels (0-3)"
              value={formData.numMajorVessels || ""}
              onChange={handleChange}
            />
            <input
              className="heart-page-input"
              type="text"
              name="thal"
              placeholder="Thal (Thallium Stress Test Result)"
              value={formData.thal || ""}
              onChange={handleChange}
            />
          </div>
          <div className="heart-page-upload-report-container">
            <p>
              Don't want to type manually? Upload your report and we will do it
              for you
            </p>
            <label htmlFor="upload-report" className="heart-page-upload-label">
              <FiUpload className="heart-page-upload-icon" /> Upload Report
              <input
                id="upload-report"
                type="file"
                accept="application/pdf"
                onChange={handleUploadReport}
                className="heart-page-upload-input"
              />
            </label>
            <button type="submit" className="heart-page-button">
              Predict
            </button>
          </div>
        </form>
      ) : (
        <div className="heart-page-result-container">
          <p style={{ fontWeight: "bolder", fontSize: "1.5rem" }}>
            Prediction Result:
          </p>
          <p>Age: {formData.age}</p>
          <p>Sex: {formData.sex === 1 ? "Male" : "Female"}</p>
          <p>Chest Pain Type: {formData.chestPainType}</p>
          <p>Resting Blood Pressure: {formData.restingBloodPressure}</p>
          <p>Serum Cholesterol: {formData.serumCholesterol}</p>
          <p>
            Fasting Blood Sugar:{" "}
            {formData.fastingBloodSugar === 1 ? "Yes" : "No"}
          </p>
          <p>Resting ECG: {formData.restingECG}</p>
          <p>Maximum Heart Rate Achieved: {formData.maxHeartRate}</p>
          <p>
            Exercise Induced Angina:{" "}
            {formData.exerciseInducedAngina === "1" ? "Yes" : "No"}
          </p>
          <p>Old Peak: {formData.oldPeak}</p>
          <p>Slope: {formData.slope}</p>
          <p>Number of Major Vessels (0-3): {formData.numMajorVessels}</p>
          <p>Thal (Thallium Stress Test Result): {formData.thal}</p>
          <p
            className={`prediction-text ${
              predictionResult.includes("not suffering")
                ? "no-heart-disease"
                : "heart-disease"
            }`}
          >
            {predictionResult}
          </p>
          {/* Download Custom PDF button */}
          <button className="heart-page-button" onClick={generateDynamicPDF}>
            Download Report
          </button>
          <button className="heart-page-button" onClick={handleRePredict}>
            Re-predict
          </button>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default HeartPage;
