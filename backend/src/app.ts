import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { routes } from "./routes";
import { tenantMiddleware } from "./core/middleware/tenant";
import { errorHandler } from "./core/middleware/error-handler";
import { logger } from "./config/logger";

export function buildApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));
  app.use(pinoHttp({ logger }));

  app.use(tenantMiddleware);
  app.use(routes);
  app.use(errorHandler);

  return app;
}
