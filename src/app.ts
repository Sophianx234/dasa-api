import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieparser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongosanitize from 'express-mongo-sanitize'
import hpp from 'hpp'
import cors from 'cors'
import compression from 'compression'

import mediaRoute from "./routes/mediaRoute";
import usersRoute from "./routes/userRoutes";
import messagesRoute from "./routes/MessageRoute";
import productsRoute from "./routes/productsRoute";
import anonymousRoute from "./routes/anonymousRoute";
import { AppError } from "./utils/AppError";
import { globalError } from "./utils/globalError";

export type customError = Error & {
  statusCode: number;
  status: string;
  isOperational?: boolean;
  code?: number;
};
dotenv.config();
const app = express();
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many request from this IP, please try again in an hour!",
// });

app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// app.use("/api", limiter);
app.use(compression())
app.use(cors())
app.use(express.json({
  limit:'10kb'
}));
app.use(mongosanitize())
app.use(hpp())
app.use(cookieparser());

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
