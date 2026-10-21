import { Router } from "express";
import { smartDropController } from "./smart-drops.controller";

export const smartDropRoutes = Router();

smartDropRoutes.post("/deposit", smartDropController);
