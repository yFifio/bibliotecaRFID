import { Request, Response } from "express";
import { z } from "zod";
import { processGatePass } from "./security-gates.service";

const schema = z.object({
  libraryId: z.string().min(1),
  deviceId: z.string().min(1),
  epc: z.string().min(1)
});

export async function securityGatePassController(req: Request, res: Response) {
  const payload = schema.parse(req.body);
  const result = await processGatePass({ tenantId: req.tenantId, ...payload });
  return res.status(200).json(result);
}
