import { Router } from "express";
import { createConnectorController, syncController } from "./integrations.controller";

export const integrationRoutes = Router();

integrationRoutes.post("/connectors", createConnectorController);
integrationRoutes.post("/sync", syncController);
