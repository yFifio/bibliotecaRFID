import { Router } from "express";
import { selfCheckoutController } from "./self-checkout.controller";

export const selfCheckoutRoutes = Router();

selfCheckoutRoutes.post("/batch", selfCheckoutController);
