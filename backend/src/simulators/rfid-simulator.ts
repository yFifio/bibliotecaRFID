import { prisma } from "../lib/prisma";
import { checkoutBatch } from "../modules/self-checkout/self-checkout.service";
import { processSmartDrop } from "../modules/smart-drops/smart-drops.service";
import { inventoryScan } from "../modules/inventory/inventory.service";
import { processGatePass } from "../modules/security-gates/security-gates.service";

export async function runFullSimulation(tenantId: string, libraryId: string) {
  const borrower = await prisma.user.findFirst({ where: { institutionId: tenantId, role: "STUDENT" } });
  const copies = await prisma.bookCopy.findMany({ where: { institutionId: tenantId, libraryId }, take: 3 });
  const gate = await prisma.device.findFirst({ where: { institutionId: tenantId, type: "GATE_ANTENNA" } });
  const handheld = await prisma.device.findFirst({ where: { institutionId: tenantId, type: "HANDHELD" } });

  if (!borrower || copies.length < 2 || !gate) {
    return { ok: false, message: "Dados insuficientes para simulação" };
  }

  const checkoutCandidates = [copies[0], copies[1]];
  const unauthorizedCandidate = copies[2] ?? copies[0];

  await prisma.$transaction(async (tx) => {
    for (const copy of checkoutCandidates) {
      await tx.loan.updateMany({
        where: {
          institutionId: tenantId,
          bookCopyId: copy.id,
          status: { in: ["OPEN", "OVERDUE"] }
        },
        data: {
          status: "CLOSED",
          returnedAt: new Date()
        }
      });

      await tx.bookCopy.update({
        where: { id: copy.id },
        data: { status: "AVAILABLE" }
      });
    }

    await tx.loan.updateMany({
      where: {
        institutionId: tenantId,
        bookCopyId: unauthorizedCandidate.id,
        status: { in: ["OPEN", "OVERDUE"] }
      },
      data: {
        status: "CLOSED",
        returnedAt: new Date()
      }
    });

    await tx.bookCopy.update({
      where: { id: unauthorizedCandidate.id },
      data: { status: "AVAILABLE" }
    });
  });

  const checkout = await checkoutBatch({
    tenantId,
    libraryId,
    borrowerId: borrower.id,
    epcs: checkoutCandidates.map((copy) => copy.rfidTagEpc)
  });

  const drop = await processSmartDrop({
    tenantId,
    libraryId,
    epc: copies[0].rfidTagEpc
  });

  const openSession = await prisma.inventorySession.findFirst({
    where: { institutionId: tenantId, libraryId, status: "RUNNING" },
    orderBy: { startedAt: "desc" }
  });

  let inventoryResult = null;
  if (openSession) {
    inventoryResult = await inventoryScan({
      tenantId,
      sessionId: openSession.id,
      epc: copies[1].rfidTagEpc,
      detectedShelfId: copies[1].shelfId ?? undefined,
      rssi: -48
    });
  }

  const gateAuthorized = await processGatePass({
    tenantId,
    libraryId,
    deviceId: gate.id,
    epc: copies[1].rfidTagEpc
  });

  const gateUnauthorized = await processGatePass({
    tenantId,
    libraryId,
    deviceId: gate.id,
    epc: unauthorizedCandidate.rfidTagEpc
  });

  return {
    ok: true,
    checkout,
    drop,
    inventoryResult,
    gateAuthorized,
    gateUnauthorized,
    simulatedWith: {
      handheldDeviceId: handheld?.id,
      gateDeviceId: gate.id
    }
  };
}
