import { Request, Response } from "express";
import { z } from "zod";
import { finishInventorySession, inventoryScan, startInventorySession } from "./inventory.service";

const startSchema = z.object({
  libraryId: z.string().min(1),
  startedByUserId: z.string().min(1),
  handheldDeviceId: z.string().optional()
});

const scanSchema = z.object({
  sessionId: z.string().min(1),
  epc: z.string().min(1),
  detectedShelfId: z.string().optional(),
  rssi: z.number().optional()
});

const finishSchema = z.object({
  sessionId: z.string().min(1)
});

export async function startInventoryController(req: Request, res: Response) {
  const payload = startSchema.parse(req.body);
  const result = await startInventorySession({ tenantId: req.tenantId, ...payload });
  return res.status(201).json(result);
}

export async function inventoryScanController(req: Request, res: Response) {
  const payload = scanSchema.parse(req.body);
  const result = await inventoryScan({ tenantId: req.tenantId, ...payload });
  return res.status(200).json(result);
}

export async function finishInventoryController(req: Request, res: Response) {
  const payload = finishSchema.parse(req.body);
  const result = await finishInventorySession(req.tenantId, payload.sessionId);
  return res.status(200).json(result);
}
