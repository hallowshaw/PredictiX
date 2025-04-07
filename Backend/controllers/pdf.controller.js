import { spawn } from "child_process";
import path from "path";
import fs from "fs";

// Function to handle Heart Disease Report scraping
export const heartScraper = (req, res) => {
  const pdfPath = path.join("uploads", req.file.filename);

  const pythonProcess = spawn("python", [
    "../DataScrapingScripts/scrapHeart.py",
    pdfPath,
  ]);

  pythonProcess.stdout.on("data", (data) => {
    try {
      const extractedData = JSON.parse(data.toString());
      res.json(extractedData);

      // Delete the PDF file after sending response
      deleteFile(pdfPath);
    } catch (error) {
      console.error("Error parsing JSON data from Python script:", error);
      res.status(500).send("Error processing PDF");

      // Delete the PDF file on error
      deleteFile(pdfPath);
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send("Error processing PDF");

    // Delete the PDF file on error
    deleteFile(pdfPath);
  });

  pythonProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);

    if (code !== 0 && !res.headersSent) {
      res.status(500).send("Error processing PDF");
    }

    // Delete the PDF file after processing
    deleteFile(pdfPath);
  });
};

function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting PDF file:", err);
    } else {
      console.log("PDF file deleted successfully");
    }
  });
}

// Function to handle Diabetes Report scraping
export const diabetesScraper = (req, res) => {
  const pdfPath = path.join("uploads", req.file.filename);

  const pythonProcess = spawn("python", [
    "../DataScrapingScripts/scrapDiabetes.py",
    pdfPath,
  ]);

  pythonProcess.stdout.on("data", (data) => {
    try {
      const extractedData = JSON.parse(data.toString());
      // Implement your diabetes prediction logic here using extractedData

      // For demonstration, sending extracted data back as response
      res.json(extractedData);

      // Delete the PDF file after sending response
      deleteFile(pdfPath);
    } catch (error) {
      console.error("Error parsing JSON data from Python script:", error);
      res.status(500).send("Error processing PDF");

      // Delete the PDF file on error
      deleteFile(pdfPath);
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send("Error processing PDF");

    // Delete the PDF file on error
    deleteFile(pdfPath);
  });

  pythonProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);

    if (code !== 0 && !res.headersSent) {
      res.status(500).send("Error processing PDF");
    }

    // Delete the PDF file after processing
    deleteFile(pdfPath);
  });
};
