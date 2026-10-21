import { Router } from "express";
import { runSimulationController } from "./simulator.controller";

export const simulatorRoutes = Router();

simulatorRoutes.post("/run", runSimulationController);
