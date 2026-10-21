import { Request, Response } from "express";
import { z } from "zod";
import { onboardingHelp, registerAccount } from "./onboarding.service";

const registerSchema = z.object({
  institutionTaxId: z.string().min(3),
  libraryCode: z.string().min(2),
  fullName: z.string().min(3),
  email: z.string().email(),
  role: z.enum(["STUDENT", "RESEARCHER", "LIBRARIAN", "ATTENDANT", "MANAGER", "ADMIN"]).default("STUDENT"),
  cardUid: z.string().optional()
});

export async function registerAccountController(req: Request, res: Response) {
  const payload = registerSchema.parse(req.body);
  const result = await registerAccount(payload);
  return res.status(201).json(result);
}

export function onboardingHelpController(_req: Request, res: Response) {
  return res.status(200).json(onboardingHelp());
}
