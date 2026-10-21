import { UserRole, UserStatus } from "@prisma/client";
import { AppError } from "../../core/errors/app-error";
import { prisma } from "../../lib/prisma";

type RegisterInput = {
  institutionTaxId: string;
  libraryCode: string;
  fullName: string;
  email: string;
  role: UserRole;
  cardUid?: string;
};

export async function registerAccount(input: RegisterInput) {
  const institution = await prisma.institution.findUnique({
    where: { taxId: input.institutionTaxId }
  });

  if (!institution) {
    throw new AppError("Instituição não encontrada. Confira CNPJ/TaxId.", 404);
  }

  const library = await prisma.library.findFirst({
    where: {
      institutionId: institution.id,
      code: input.libraryCode
    }
  });

  if (!library) {
    throw new AppError("Biblioteca não encontrada. Confira o código da biblioteca.", 404);
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      institutionId: institution.id,
      email: input.email
    }
  });

  if (existingUser) {
    return {
      created: false,
      message: "Conta já existia e foi reutilizada.",
      account: {
        userId: existingUser.id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role
      },
      context: {
        tenantId: institution.id,
        libraryId: library.id,
        libraryCode: library.code
      }
    };
  }

  const user = await prisma.user.create({
    data: {
      institutionId: institution.id,
      libraryId: library.id,
      role: input.role,
      status: UserStatus.ACTIVE,
      fullName: input.fullName,
      email: input.email,
      cardUid: input.cardUid
    }
  });

  return {
    created: true,
    message: "Conta cadastrada com sucesso.",
    account: {
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    },
    context: {
      tenantId: institution.id,
      libraryId: library.id,
      libraryCode: library.code
    }
  };
}

export function onboardingHelp() {
  return {
    quickSteps: [
      "1) Preencha CNPJ/TaxId, código da biblioteca, nome e e-mail.",
      "2) Clique em cadastrar conta.",
      "3) Copie os IDs retornados (tenantId e libraryId) para usar nas operações.",
      "4) No frontend, esses IDs podem ser salvos automaticamente no navegador."
    ],
    defaultSeed: {
      institutionTaxId: "00.000.000/0001-00",
      libraryCode: "BIB-CENTRAL"
    }
  };
}
