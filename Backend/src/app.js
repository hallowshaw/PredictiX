import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import predRouter from "./routes/prediction.routes.js";
import pdfRouter from "./routes/pdf.routes.js"; // Import pdfRoutes

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow requests with no origin, like mobile apps or curl requests
      if (
        allowedOrigins.indexOf("*") !== -1 ||
        allowedOrigins.indexOf(origin) !== -1
      ) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Configurations for different types of data acceptance
// Limiting json data acceptance
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/predict", predRouter);
app.use("/api/pdf", pdfRouter);// Add this line to include the new PDF routes

export { app };
