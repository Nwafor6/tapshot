import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { failedResponse } from "./support/http";
import { httpLogger } from "./httpLogger";
import Database from "./db";
import { checkApiKey } from "./support/middleware";
import { authRouter } from "./routers/userRouters";
import { statRouter } from "./routers/statsRoute";

const app: Application = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(httpLogger);
app.use(checkApiKey);
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("./uploads"));
app.use(express.json());
app.use("/", authRouter);
app.use("/stats", statRouter);

// CONNECT TO DB
if (process.env.PROJ_ENV === "DEV" || process.env.PROJ_ENV === "PRODUCTION") {
  Database.getInstance();
}

app.use((req: Request, res: Response, next: NextFunction) => {
  failedResponse(res, 404, `Invalid endpoint, inspect url again.`);
});

export default app;
