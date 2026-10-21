import { Request, Response } from "express";
import { z } from "zod";
import { createConnector, syncToLegacy } from "./integrations.service";

const connectorSchema = z.object({
  system: z.enum(["PERGAMUM", "SOPHIA", "KOHA", "CUSTOM"]),
  name: z.string().min(1),
  baseUrl: z.string().url().optional()
});

const syncSchema = z.object({
  connectorId: z.string().min(1),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  payload: z.record(z.unknown()).default({})
});

export async function createConnectorController(req: Request, res: Response) {
  const payload = connectorSchema.parse(req.body);
  const result = await createConnector(req.tenantId, payload.system, payload.name, payload.baseUrl);
  return res.status(201).json(result);
}

export async function syncController(req: Request, res: Response) {
  const payload = syncSchema.parse(req.body);
  const result = await syncToLegacy({ tenantId: req.tenantId, ...payload });
  return res.status(201).json(result);
}
