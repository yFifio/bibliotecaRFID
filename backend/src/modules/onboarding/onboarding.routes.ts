import { Router } from "express";
import { onboardingHelpController, registerAccountController } from "./onboarding.controller";

export const onboardingRoutes = Router();

onboardingRoutes.get("/help", onboardingHelpController);
onboardingRoutes.post("/register", registerAccountController);
