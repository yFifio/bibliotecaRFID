import { Request, Response } from "express";
import { z } from "zod";
import { ingestIotEvent, listIotEvents } from "./iot-events.service";

const ingestSchema = z.object({
  libraryId: z.string().optional(),
  deviceId: z.string().optional(),
  eventType: z.enum(["RFID_READ", "SMART_DROP_DEPOSIT", "INVENTORY_SCAN", "GATE_PASSAGE", "SENSOR_SIGNAL", "HEARTBEAT"]),
  source: z.enum(["KIOSK", "SMART_DROP", "HANDHELD", "GATE", "INTEGRATION", "UNKNOWN"]),
  epc: z.string().optional(),
  payloadJson: z.record(z.unknown()).default({})
});

const querySchema = z.object({
  limit: z.coerce.number().min(1).max(200).default(50)
});

export async function ingestIotEventController(req: Request, res: Response) {
  const payload = ingestSchema.parse(req.body);
  const event = await ingestIotEvent({ tenantId: req.tenantId, ...payload });
  return res.status(201).json(event);
}

export async function listIotEventsController(req: Request, res: Response) {
  const query = querySchema.parse(req.query);
  const events = await listIotEvents(req.tenantId, query.limit);
  return res.status(200).json(events);
}
