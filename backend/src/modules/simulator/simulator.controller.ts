import { Request, Response } from "express";
import { z } from "zod";
import { runFullSimulation } from "../../simulators/rfid-simulator";

const schema = z.object({
  libraryId: z.string().min(1)
});

export async function runSimulationController(req: Request, res: Response) {
  const payload = schema.parse(req.body);
  const result = await runFullSimulation(req.tenantId, payload.libraryId);
  return res.status(200).json(result);
}
