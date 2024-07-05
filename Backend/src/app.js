import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//Configurations for different types of data acceptance
//Limiting json data acceptance
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
import predRouter from "./routes/prediction.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/predict", predRouter);

export { app };
