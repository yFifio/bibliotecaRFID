import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";

declare global {
  namespace Express {
    interface Request {
      tenantId: string;
      libraryId?: string;
      actorUserId?: string;
    }
  }
}

export function tenantMiddleware(req: Request, _res: Response, next: NextFunction) {
  const publicPaths = ["/health", "/api/v1/onboarding/register", "/api/v1/onboarding/help"];
  if (publicPaths.includes(req.path)) {
    return next();
  }

  const tenantId = req.header("x-tenant-id");
  if (!tenantId) {
    throw new AppError("x-tenant-id header is required", 400);
  }

  req.tenantId = tenantId;
  req.libraryId = req.header("x-library-id") ?? undefined;
  req.actorUserId = req.header("x-actor-user-id") ?? undefined;
  next();
}
