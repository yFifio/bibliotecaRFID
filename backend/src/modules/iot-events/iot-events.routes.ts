import { Router } from "express";
import { ingestIotEventController, listIotEventsController } from "./iot-events.controller";

export const iotEventsRoutes = Router();

iotEventsRoutes.post("/ingest", ingestIotEventController);
iotEventsRoutes.get("/", listIotEventsController);
