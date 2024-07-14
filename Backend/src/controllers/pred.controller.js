import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

import path from "path";
import fs from "fs";

// Set up multer for file uploads

// Get the directory path of the current ES module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//------------------------------------

import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

export { upload };

// Define the relative path to the heartpredict.py script
const heartPath = resolve(
  __dirname,
  "../../../ML/Heart Disease Prediction/heartpredict.py"
);

// Define the relative path to the diabetespredict.py script
const diabetesPath = resolve(
  __dirname,
  "../../../ML/Diabetes Prediction/diabetespredict.py"
);

const heartpred = asyncHandler(async (req, res) => {
  try {
    const { p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13 } = req.body;

    // Condition check for p2: If male (assuming 1 for male and 0 for female)
    const transformedP2 = isNaN(p2) ? (p2.toLowerCase() === "male" ? 1 : 0) : p2;

    // Condition check for p6: If yes (assuming 1 for yes and 0 for no)
    const transformedP6 = isNaN(p6) ? (p6.toLowerCase() === "yes" ? 1 : 0) : p6;


    const python = spawn("python", [
      heartPath,
      p1,
      transformedP2.toString(),
      p3,
      p4,
      p5,
      transformedP6.toString(),
      p7,
      p8,
      p9,
      p10,
      p11,
      p12,
      p13,
    ]);

    let predictionVal = "";

    python.stdout.on("data", (data) => {
      console.log("python stdout: ", data.toString());
      predictionVal = data.toString().trim();
    });

    python.stderr.on("data", (data) => {
      console.error("python stderr: ", data.toString());
    });

    python.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        res.status(500).json({ message: "Python script error" });
      } else {
        console.log("predictionVal: ", predictionVal);
        console.log(typeof predictionVal);
        if (predictionVal === "1") {
          res.json({
            prediction: predictionVal.trim(),
            result: "The person is suffering from Heart Disease",
          });
        } else if (predictionVal === "0") {
          res.json({
            prediction: predictionVal.trim(),
            result: "The person is not suffering from Heart Disease",
          });
        }
      }
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Failed to predict" });
  }
});



const diabetespred = asyncHandler(async (req, res) => {
  try {
    const {
      pregnancies,
      glucose,
      bloodPressure,
      skinThickness,
      insulin,
      bmi,
      diabetesPedigreeFunction,
      age,
    } = req.body;

    const inputData = [
      pregnancies,
      glucose,
      bloodPressure,
      skinThickness,
      insulin,
      bmi,
      diabetesPedigreeFunction,
      age,
    ];

    if (!inputData.every((value) => typeof value !== "undefined")) {
      throw new ApiError(400, "All inputData fields must be provided");
    }

    const pythonProcess = spawn("python", [diabetesPath, ...inputData]);

    let predictionVal = "";

    pythonProcess.stdout.on("data", (data) => {
      console.log("python stdout: ", data.toString());
      predictionVal = data.toString().trim();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data.toString()}`);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        res.status(500).json({ message: "Python script error" });
      } else {
        console.log("predictionVal: ", predictionVal);
        console.log(typeof predictionVal);
        if (predictionVal === "1") {
          res.json({
            prediction: predictionVal.trim(),
            result: "The person is suffering from Diabetes",
          });
        } else if (predictionVal === "0") {
          res.json({
            prediction: predictionVal.trim(),
            result: "The person is not suffering from Diabetes",
          });
        }
      }
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Failed to predict" });
  }
});

const lungpred = asyncHandler(async (req, res) => {
  if (!req.file) {
    console.error("Multer did not process the file");
    throw new ApiError(400, "No image file uploaded");
  }

  const filePath = path.resolve(
    __dirname,
    "..",
    "..",
    "uploads",
    req.file.filename
  );
  console.log("Resolved file path:", filePath);

  if (!fs.existsSync(filePath)) {
    throw new ApiError(404, "Uploaded file not found");
  }

  const pythonProcess = spawn("python", [
    path.resolve(__dirname, "../../../ML/Lung Cancer Prediction/predict.py"),
    filePath,
  ]);

  let predictionData = "";
  let errorOccurred = false;

  pythonProcess.stdout.on("data", (data) => {
    predictionData += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
    errorOccurred = true;
    res.status(500).json({ error: "Prediction error" });
  });

  pythonProcess.on("close", (code) => {
    if (code === 0 && !errorOccurred) {
      res.status(200).json({ prediction: predictionData.trim() });
    } else if (!errorOccurred) {
      res.status(500).json({ error: "Prediction error" });
    }

    // Always delete the file after the prediction process
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });
  });
});

const breastpred = asyncHandler(async (req, res) => {
  if (!req.file) {
    console.error("Multer did not process the file");
    throw new ApiError(400, "No image file uploaded");
  }

  const filePath = path.resolve(
    __dirname,
    "..",
    "..",
    "uploads",
    req.file.filename
  );
  console.log("Resolved file path:", filePath);

  if (!fs.existsSync(filePath)) {
    throw new ApiError(404, "Uploaded file not found");
  }

  const pythonProcess = spawn("python", [
    path.resolve(
      __dirname,
      "../../../ML/Breast Cancer Prediction/breast_cancer_prediction.py"
    ),
    filePath,
  ]);

  let predictionData = "";
  let errorOccurred = false;

  pythonProcess.stdout.on("data", (data) => {
    predictionData += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
    errorOccurred = true;
    res.status(500).json({ error: "Prediction error" });
  });

  pythonProcess.on("close", (code) => {
    if (code === 0 && !errorOccurred) {
      res.status(200).json({ prediction: predictionData.trim() });
    } else if (!errorOccurred) {
      res.status(500).json({ error: "Prediction error" });
    }

    // Always delete the file after the prediction process
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });
  });
});

export { heartpred, diabetespred, lungpred, breastpred };
