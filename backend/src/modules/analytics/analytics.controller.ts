import { Request, Response } from "express";
import { z } from "zod";
import { getManagementDashboard } from "./analytics.service";

const querySchema = z.object({
  libraryId: z.string().min(1)
});

export async function dashboardController(req: Request, res: Response) {
  const query = querySchema.parse(req.query);
  const result = await getManagementDashboard(req.tenantId, query.libraryId);
  return res.status(200).json(result);
}
