import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const institution = await prisma.institution.upsert({
    where: { taxId: "00.000.000/0001-00" },
    update: {},
    create: {
      name: "Instituto Exemplo RFID",
      taxId: "00.000.000/0001-00"
    }
  });

  const library = await prisma.library.upsert({
    where: {
      institutionId_code: {
        institutionId: institution.id,
        code: "BIB-CENTRAL"
      }
    },
    update: {},
    create: {
      institutionId: institution.id,
      code: "BIB-CENTRAL",
      name: "Biblioteca Central"
    }
  });

  const shelfA = await prisma.shelf.upsert({
    where: { libraryId_code: { libraryId: library.id, code: "A-01" } },
    update: {},
    create: { libraryId: library.id, code: "A-01", section: "A", floor: "1" }
  });

  const shelfB = await prisma.shelf.upsert({
    where: { libraryId_code: { libraryId: library.id, code: "B-01" } },
    update: {},
    create: { libraryId: library.id, code: "B-01", section: "B", floor: "1" }
  });

  const student =
    (await prisma.user.findFirst({
      where: { institutionId: institution.id, email: "aluno@exemplo.edu" }
    })) ??
    (await prisma.user.create({
      data: {
        institutionId: institution.id,
        libraryId: library.id,
        role: "STUDENT",
        status: "ACTIVE",
        fullName: "Aluno Teste",
        email: "aluno@exemplo.edu",
        cardUid: "CARD-123"
      }
    }));

  await prisma.user.upsert({
    where: { id: (await prisma.user.findFirst({ where: { institutionId: institution.id, email: "operacao@exemplo.edu" }, select: { id: true } }))?.id ?? "__create__" },
    update: {
      libraryId: library.id,
      role: "LIBRARIAN",
      status: "ACTIVE",
      fullName: "Bibliotecária Operação"
    },
    create: {
      institutionId: institution.id,
      libraryId: library.id,
      role: "LIBRARIAN",
      status: "ACTIVE",
      fullName: "Bibliotecária Operação",
      email: "operacao@exemplo.edu"
    }
  });

  async function getOrCreateTitle(params: { title: string; isbn: string }) {
    const found = await prisma.bookTitle.findFirst({
      where: { institutionId: institution.id, isbn: params.isbn }
    });
    if (found) {
      return found;
    }
    return prisma.bookTitle.create({
      data: {
        institutionId: institution.id,
        title: params.title,
        isbn: params.isbn
      }
    });
  }

  const titles = await Promise.all([
    getOrCreateTitle({ title: "Arquitetura de Sistemas Distribuídos", isbn: "978000000001" }),
    getOrCreateTitle({ title: "Prisma e Modelagem Relacional", isbn: "978000000002" }),
    getOrCreateTitle({ title: "RFID na Gestão de Acervos", isbn: "978000000003" })
  ]);

  const epcs = ["EPC-1001", "EPC-1002", "EPC-1003"];
  await Promise.all(
    titles.map((title, index) =>
      prisma.bookCopy.upsert({
        where: { rfidTagEpc: epcs[index] },
        update: {
          institutionId: institution.id,
          libraryId: library.id,
          bookTitleId: title.id,
          shelfId: index === 2 ? shelfB.id : shelfA.id,
          status: "AVAILABLE"
        },
        create: {
          institutionId: institution.id,
          libraryId: library.id,
          bookTitleId: title.id,
          shelfId: index === 2 ? shelfB.id : shelfA.id,
          rfidTagEpc: epcs[index],
          status: "AVAILABLE"
        }
      })
    )
  );

  await Promise.all([
    prisma.device.upsert({
      where: { institutionId_code: { institutionId: institution.id, code: "KIOSK-01" } },
      update: { libraryId: library.id, type: "KIOSK", status: "ONLINE", locationLabel: "Entrada" },
      create: {
        institutionId: institution.id,
        libraryId: library.id,
        code: "KIOSK-01",
        type: "KIOSK",
        status: "ONLINE",
        locationLabel: "Entrada"
      }
    }),
    prisma.device.upsert({
      where: { institutionId_code: { institutionId: institution.id, code: "DROP-01" } },
      update: { libraryId: library.id, type: "SMART_DROP", status: "ONLINE", locationLabel: "Área externa" },
      create: {
        institutionId: institution.id,
        libraryId: library.id,
        code: "DROP-01",
        type: "SMART_DROP",
        status: "ONLINE",
        locationLabel: "Área externa"
      }
    }),
    prisma.device.upsert({
      where: { institutionId_code: { institutionId: institution.id, code: "HANDHELD-01" } },
      update: { libraryId: library.id, type: "HANDHELD", status: "ONLINE", locationLabel: "Operação" },
      create: {
        institutionId: institution.id,
        libraryId: library.id,
        code: "HANDHELD-01",
        type: "HANDHELD",
        status: "ONLINE",
        locationLabel: "Operação"
      }
    }),
    prisma.device.upsert({
      where: { institutionId_code: { institutionId: institution.id, code: "GATE-01" } },
      update: { libraryId: library.id, type: "GATE_ANTENNA", status: "ONLINE", locationLabel: "Saída principal" },
      create: {
        institutionId: institution.id,
        libraryId: library.id,
        code: "GATE-01",
        type: "GATE_ANTENNA",
        status: "ONLINE",
        locationLabel: "Saída principal"
      }
    })
  ]);

  const existingRunningSession = await prisma.inventorySession.findFirst({
    where: { institutionId: institution.id, libraryId: library.id, status: "RUNNING" }
  });

  if (!existingRunningSession) {
    await prisma.inventorySession.create({
      data: {
        institutionId: institution.id,
        libraryId: library.id,
        startedByUserId: student.id,
        status: "RUNNING",
        totalExpected: 3
      }
    });
  }

  const date = new Date(new Date().setHours(0, 0, 0, 0));
  await prisma.analyticsDaily.upsert({
    where: { libraryId_date: { libraryId: library.id, date } },
    update: {
      sectionHeatmapJson: {
        sections: [
          { code: "A", intensity: 0.8 },
          { code: "B", intensity: 0.45 }
        ]
      },
      savedWorkMinutes: 320
    },
    create: {
      institutionId: institution.id,
      libraryId: library.id,
      date,
      sectionHeatmapJson: {
        sections: [
          { code: "A", intensity: 0.8 },
          { code: "B", intensity: 0.45 }
        ]
      },
      savedWorkMinutes: 320
    }
  });

  console.log({ institutionId: institution.id, libraryId: library.id, studentId: student.id });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
