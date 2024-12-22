import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from 'morgan'

import mediaRoute from "./routes/mediaRoute";
import usersRoute from "./routes/userRoutes";
import messagesRoute from "./routes/MessageRoute"
import productsRoute from './routes/productsRoute'
import anonymousRoute from './routes/anonymousRoute'
import { AppError } from "./utils/AppError";
import { globalError } from "./utils/globalError";

export type customError = Error & {
  statusCode: number;
  status: string;
  isOperational?: boolean;
};
dotenv.config();
const app = express();
app.use(morgan('dev'))
app.use(express.json());

app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/products", productsRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/messages", messagesRoute);
app.use("/api/v1/anonymous", anonymousRoute);

app.all("*", function (req: Request, res: Response, next: NextFunction) {
  next(new AppError(`can't find ${req.originalUrl} on this server `, 404));
});

app.use(globalError);

export default app;
