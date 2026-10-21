import { AlertSeverity, SecurityAlertType } from "@prisma/client";
import { prisma } from "../../lib/prisma";

type GatePassInput = {
  tenantId: string;
  libraryId: string;
  deviceId: string;
  epc: string;
};

export async function processGatePass(input: GatePassInput) {
  const copy = await prisma.bookCopy.findFirst({
    where: { institutionId: input.tenantId, libraryId: input.libraryId, rfidTagEpc: input.epc }
  });

  const activeLoan = copy
    ? await prisma.loan.findFirst({
        where: { institutionId: input.tenantId, bookCopyId: copy.id, status: { in: ["OPEN", "OVERDUE"] } }
      })
    : null;

  const authorized = Boolean(activeLoan);

  const gateEvent = await prisma.gateEvent.create({
    data: {
      institutionId: input.tenantId,
      libraryId: input.libraryId,
      deviceId: input.deviceId,
      bookCopyId: copy?.id,
      epc: input.epc,
      authorized,
      reason: authorized ? "AUTHORIZED_ON_LOAN" : "NOT_REGISTERED_AS_LOAN",
      occurredAt: new Date()
    }
  });

  if (!authorized) {
    await prisma.securityAlert.create({
      data: {
        institutionId: input.tenantId,
        libraryId: input.libraryId,
        deviceId: input.deviceId,
        type: SecurityAlertType.UNAUTHORIZED_EXIT,
        severity: AlertSeverity.HIGH,
        title: "Tentativa de saída sem empréstimo",
        description: `Livro EPC ${input.epc} detectado sem empréstimo ativo no portal`,
        relatedEpc: input.epc
      }
    });
  }

  return {
    eventId: gateEvent.id,
    authorized,
    alarmTriggered: !authorized
  };
}
