import { Router } from "express";
import {
  finishInventoryController,
  inventoryScanController,
  startInventoryController
} from "./inventory.controller";

export const inventoryRoutes = Router();

inventoryRoutes.post("/sessions", startInventoryController);
inventoryRoutes.post("/scan", inventoryScanController);
inventoryRoutes.post("/finish", finishInventoryController);
