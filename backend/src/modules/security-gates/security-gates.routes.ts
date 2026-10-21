import { Router } from "express";
import { securityGatePassController } from "./security-gates.controller";

export const securityGateRoutes = Router();

securityGateRoutes.post("/passage", securityGatePassController);
