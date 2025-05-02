import compression from "compression";
import cookieparser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import mongosanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";

import mediaRoute from "./routes/mediaRoute";
import messagesRoute from "./routes/MessageRoute";
import productsRoute from "./routes/productsRoute";
import usersRoute from "./routes/userRoutes";
import eventsRoute from "./routes/eventsRoute";
import announcementRoute from "./routes/announcementRoute";
import notificationsRoute from "./routes/notificationsRoute";
import { AppError } from "./utils/AppError";
import { globalError } from "./utils/globalError";
import rateLimit from "express-rate-limit";

export type customError = Error & {
  statusCode: number;
  status: string;
  isOperational?: boolean;
  code?: number;
};
dotenv.config();
const app = express();
 const limiter = rateLimit({
   max: 100,
  windowMs: 60 * 60 * 1000,
   message: "Too many request from this IP, please try again in an hour!",
 });

 app.use(
  cors({
    origin: ['http://localhost:5173','https://dasaug.netlify.app'],
    credentials: true,

  })
); 
app.use(helmet());
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
app.use(cookieparser());
// app.use("/api", limiter);
app.use(compression());

app.use(
  express.json({
    limit: "10kb",
  }),
);
app.use(mongosanitize());
app.use(hpp());

app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/products", productsRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/messages", messagesRoute);
app.use("/api/v1/events", eventsRoute);
app.use("/api/v1/announcements", announcementRoute);
app.use("/api/v1/notifications", notificationsRoute);

app.all("*", function (req: Request, res: Response, next: NextFunction) {
  next(new AppError(`can't find ${req.originalUrl} on this server `, 404));
});

app.use(globalError);

export default app;
