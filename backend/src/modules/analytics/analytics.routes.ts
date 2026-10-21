import { Router } from "express";
import { dashboardController } from "./analytics.controller";

export const analyticsRoutes = Router();

analyticsRoutes.get("/dashboard", dashboardController);
