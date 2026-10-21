import { Request, Response } from "express";
import { z } from "zod";
import { processSmartDrop } from "./smart-drops.service";

const schema = z.object({
  libraryId: z.string().min(1),
  epc: z.string().min(1),
  deviceCode: z.string().optional()
});

export async function smartDropController(req: Request, res: Response) {
  const payload = schema.parse(req.body);
  const result = await processSmartDrop({ tenantId: req.tenantId, ...payload });
  return res.status(200).json(result);
}
