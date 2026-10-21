import { Router } from "express";
import { selfCheckoutRoutes } from "../modules/self-checkout/self-checkout.routes";
import { smartDropRoutes } from "../modules/smart-drops/smart-drops.routes";
import { inventoryRoutes } from "../modules/inventory/inventory.routes";
import { securityGateRoutes } from "../modules/security-gates/security-gates.routes";
import { analyticsRoutes } from "../modules/analytics/analytics.routes";
import { integrationRoutes } from "../modules/integrations/integrations.routes";
import { iotEventsRoutes } from "../modules/iot-events/iot-events.routes";
import { simulatorRoutes } from "../modules/simulator/simulator.routes";
import { onboardingRoutes } from "../modules/onboarding/onboarding.routes";

export const v1Routes = Router();

v1Routes.use("/self-checkout", selfCheckoutRoutes);
v1Routes.use("/smart-drops", smartDropRoutes);
v1Routes.use("/inventory", inventoryRoutes);
v1Routes.use("/security-gates", securityGateRoutes);
v1Routes.use("/analytics", analyticsRoutes);
v1Routes.use("/integrations", integrationRoutes);
v1Routes.use("/iot-events", iotEventsRoutes);
v1Routes.use("/simulator", simulatorRoutes);
v1Routes.use("/onboarding", onboardingRoutes);
