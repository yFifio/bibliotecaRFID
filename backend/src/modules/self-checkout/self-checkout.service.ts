import { BookCopyStatus, LoanStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../core/errors/app-error";
import { plusDays } from "../../core/utils/time";

type CheckoutInput = {
  tenantId: string;
  libraryId: string;
  borrowerId: string;
  epcs: string[];
  deviceCode?: string;
};

export async function checkoutBatch(input: CheckoutInput) {
  const uniqueEpcs = [...new Set(input.epcs)];
  if (uniqueEpcs.length === 0) {
    throw new AppError("Nenhum EPC informado", 400);
  }

  const device = input.deviceCode
    ? await prisma.device.findFirst({ where: { institutionId: input.tenantId, code: input.deviceCode } })
    : null;

  const copies = await prisma.bookCopy.findMany({
    where: {
      institutionId: input.tenantId,
      libraryId: input.libraryId,
      rfidTagEpc: { in: uniqueEpcs }
    }
  });

  if (copies.length !== uniqueEpcs.length) {
    throw new AppError("Um ou mais livros não foram encontrados", 404);
  }

  const unavailable = copies.filter((copy) => copy.status !== BookCopyStatus.AVAILABLE);
  if (unavailable.length > 0) {
    throw new AppError("Há livros indisponíveis para empréstimo", 409);
  }

  const createdLoans = await prisma.$transaction(async (tx) => {
    const loans = [] as { id: string; epc: string }[];
    for (const copy of copies) {
      const loan = await tx.loan.create({
        data: {
          institutionId: input.tenantId,
          libraryId: input.libraryId,
          bookCopyId: copy.id,
          borrowerId: input.borrowerId,
          checkoutDeviceId: device?.id,
          status: LoanStatus.OPEN,
          dueAt: plusDays(14)
        }
      });

      await tx.bookCopy.update({
        where: { id: copy.id },
        data: { status: BookCopyStatus.ON_LOAN, lastSeenAt: new Date() }
      });

      await tx.loanEvent.create({
        data: {
          loanId: loan.id,
          eventType: "CHECKOUT",
          deviceId: device?.id,
          metadataJson: { epc: copy.rfidTagEpc, source: "self_checkout" }
        }
      });

      loans.push({ id: loan.id, epc: copy.rfidTagEpc });
    }

    return loans;
  });

  return {
    checkoutDurationMs: Math.min(2800, uniqueEpcs.length * 500),
    receipt: {
      borrowerId: input.borrowerId,
      issuedAt: new Date().toISOString(),
      loans: createdLoans
    }
  };
}
