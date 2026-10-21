import { InventorySessionStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../core/errors/app-error";

type StartInput = {
  tenantId: string;
  libraryId: string;
  startedByUserId: string;
  handheldDeviceId?: string;
};

export async function startInventorySession(input: StartInput) {
  const totalExpected = await prisma.bookCopy.count({
    where: { institutionId: input.tenantId, libraryId: input.libraryId }
  });

  return prisma.inventorySession.create({
    data: {
      institutionId: input.tenantId,
      libraryId: input.libraryId,
      startedByUserId: input.startedByUserId,
      handheldDeviceId: input.handheldDeviceId,
      totalExpected
    }
  });
}

type ScanInput = {
  tenantId: string;
  sessionId: string;
  epc: string;
  detectedShelfId?: string;
  rssi?: number;
};

export async function inventoryScan(input: ScanInput) {
  const session = await prisma.inventorySession.findFirst({
    where: { id: input.sessionId, institutionId: input.tenantId, status: InventorySessionStatus.RUNNING }
  });
  if (!session) {
    throw new AppError("Sessão de inventário não encontrada ou encerrada", 404);
  }

  const copy = await prisma.bookCopy.findFirst({
    where: {
      institutionId: input.tenantId,
      libraryId: session.libraryId,
      rfidTagEpc: input.epc
    }
  });

  const expectedShelfId = copy?.shelfId ?? undefined;
  const isMisplaced = Boolean(copy && input.detectedShelfId && expectedShelfId && input.detectedShelfId !== expectedShelfId);

  await prisma.inventoryRead.create({
    data: {
      inventorySessionId: session.id,
      bookCopyId: copy?.id,
      epc: input.epc,
      detectedShelfId: input.detectedShelfId,
      expectedShelfId,
      isMisplaced,
      rssi: input.rssi
    }
  });

  const [totalRead, misplacedCount] = await Promise.all([
    prisma.inventoryRead.count({ where: { inventorySessionId: session.id } }),
    prisma.inventoryRead.count({ where: { inventorySessionId: session.id, isMisplaced: true } })
  ]);

  const progressPct = session.totalExpected > 0 ? (totalRead / session.totalExpected) * 100 : 0;

  await prisma.inventorySession.update({
    where: { id: session.id },
    data: { totalRead, misplacedCount, progressPct }
  });

  return {
    sessionId: session.id,
    progressPct,
    totalRead,
    totalExpected: session.totalExpected,
    misplacedCount,
    radar: copy
      ? {
          found: true,
          epc: input.epc,
          rssi: input.rssi ?? -52,
          visual: isMisplaced ? "RED" : "GREEN",
          beep: true,
          misplaced: isMisplaced
        }
      : {
          found: false,
          epc: input.epc,
          visual: "YELLOW",
          beep: false,
          misplaced: false
        }
  };
}

export async function finishInventorySession(tenantId: string, sessionId: string) {
  const session = await prisma.inventorySession.findFirst({ where: { id: sessionId, institutionId: tenantId } });
  if (!session) {
    throw new AppError("Sessão não encontrada", 404);
  }

  return prisma.inventorySession.update({
    where: { id: sessionId },
    data: { status: InventorySessionStatus.FINISHED, endedAt: new Date() }
  });
}
