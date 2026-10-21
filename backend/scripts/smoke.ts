import "dotenv/config";
import { prisma } from "../src/lib/prisma";

type HealthResponse = {
  ok: boolean;
  service: string;
  timestamp: string;
};

type SimulatorResponse = {
  ok: boolean;
  message?: string;
  gateUnauthorized?: {
    alarmTriggered: boolean;
  };
};

async function main() {
  const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:3333";

  const institution = await prisma.institution.findFirst({
    where: { taxId: "00.000.000/0001-00" }
  });

  if (!institution) {
    throw new Error("Institution de seed não encontrada. Rode: npm run prisma:seed");
  }

  const library = await prisma.library.findFirst({
    where: {
      institutionId: institution.id,
      code: "BIB-CENTRAL"
    }
  });

  if (!library) {
    throw new Error("Library de seed não encontrada. Rode: npm run prisma:seed");
  }

  const healthResponse = await fetch(`${apiBaseUrl}/health`, {
    headers: { "x-tenant-id": institution.id }
  });

  if (!healthResponse.ok) {
    throw new Error(`Health check falhou com status ${healthResponse.status}`);
  }

  const health = (await healthResponse.json()) as HealthResponse;
  if (!health.ok) {
    throw new Error("Health check retornou ok=false");
  }

  const simulationResponse = await fetch(`${apiBaseUrl}/api/v1/simulator/run`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-tenant-id": institution.id
    },
    body: JSON.stringify({ libraryId: library.id })
  });

  if (!simulationResponse.ok) {
    const body = await simulationResponse.text();
    throw new Error(`Simulação falhou com status ${simulationResponse.status}: ${body}`);
  }

  const simulation = (await simulationResponse.json()) as SimulatorResponse;
  if (!simulation.ok) {
    throw new Error(`Simulação retornou ok=false: ${simulation.message ?? "sem mensagem"}`);
  }

  console.log("[SMOKE] Health: OK");
  console.log("[SMOKE] Simulador: OK");
  console.log(
    `[SMOKE] Antifurto acionado no caso não autorizado: ${simulation.gateUnauthorized?.alarmTriggered ? "SIM" : "NÃO"}`
  );
}

main()
  .catch((error) => {
    console.error("[SMOKE] FAIL", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
