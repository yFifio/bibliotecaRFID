import { Request, Response } from "express";
import { z } from "zod";
import { checkoutBatch } from "./self-checkout.service";

const checkoutSchema = z.object({
  libraryId: z.string().min(1),
  borrowerId: z.string().min(1),
  epcs: z.array(z.string().min(1)).min(1),
  deviceCode: z.string().min(1).optional()
});

export async function selfCheckoutController(req: Request, res: Response) {
  const payload = checkoutSchema.parse(req.body);
  const result = await checkoutBatch({
    tenantId: req.tenantId,
    ...payload
  });
  return res.status(201).json(result);
}
