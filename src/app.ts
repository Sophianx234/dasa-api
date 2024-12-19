import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

import imagesRoute from "./routes/ImagesRoute";
import usersRoute from "./routes/userRoutes";
import { AppError } from "./utils/AppError";
dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/v1/images", imagesRoute);
app.use("/api/v1/users", usersRoute);

app.all("*", function (req: Request, res: Response, next: NextFunction) {
  next(new AppError(`can't find ${req.originalUrl} on this server `,404))
});

export default app;
