import express from "express";
import dotenv from "dotenv";

import imagesRoute from "./routes/ImagesRoute";
dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/v1/images", imagesRoute);

export default app;
