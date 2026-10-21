import { BookCopyStatus, FineStatus, LoanStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../core/errors/app-error";

type SmartDropInput = {
  tenantId: string;
  libraryId: string;
  epc: string;
  deviceCode?: string;
};

export async function processSmartDrop(input: SmartDropInput) {
  const copy = await prisma.bookCopy.findFirst({
    where: { institutionId: input.tenantId, libraryId: input.libraryId, rfidTagEpc: input.epc }
  });

  if (!copy) {
    throw new AppError("Livro não encontrado para devolução", 404);
  }

  const openLoan = await prisma.loan.findFirst({
    where: {
      institutionId: input.tenantId,
      bookCopyId: copy.id,
      status: { in: [LoanStatus.OPEN, LoanStatus.OVERDUE] }
    },
    orderBy: { loanedAt: "desc" }
  });

  if (!openLoan) {
    throw new AppError("Não há empréstimo em aberto para este exemplar", 409);
  }

  const result = await prisma.$transaction(async (tx) => {
    const closedLoan = await tx.loan.update({
      where: { id: openLoan.id },
      data: { status: LoanStatus.CLOSED, returnedAt: new Date() }
    });

    await tx.bookCopy.update({
      where: { id: copy.id },
      data: { status: BookCopyStatus.AVAILABLE, lastSeenAt: new Date() }
    });

    const fine = await tx.fine.findUnique({ where: { loanId: openLoan.id } });
    if (fine && fine.status === FineStatus.PENDING) {
      await tx.fine.update({
        where: { id: fine.id },
        data: {
          status: FineStatus.WAIVED,
          settledAt: new Date()
        }
      });
    }

    await tx.loanEvent.create({
      data: {
        loanId: openLoan.id,
        eventType: "RETURN",
        metadataJson: { source: "smart_drop", epc: input.epc }
      }
    });

    return {
      loanId: closedLoan.id,
      borrowerId: closedLoan.borrowerId,
      triage: "RE_SHELVING",
      fineRemoved: Boolean(fine && fine.status === FineStatus.PENDING)
    };
  });

  return result;
}
