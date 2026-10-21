import { Router } from "express";
import { v1Routes } from "./v1";

export const routes = Router();

routes.get("/health", (_req, res) => {
  res.json({ ok: true, service: "rfid-library-backend", timestamp: new Date().toISOString() });
});

routes.use("/api/v1", v1Routes);
