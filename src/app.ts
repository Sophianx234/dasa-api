import express from "express";
import dotenv from "dotenv";

import imagesRoute from "./routes/ImagesRoute";
import usersRoute from './routes/userRoutes'
dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/v1/images", imagesRoute);
app.use("/api/v1/users", usersRoute);

export default app;
