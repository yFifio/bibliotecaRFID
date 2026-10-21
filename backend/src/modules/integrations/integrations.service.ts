import { IntegrationSyncStatus, IntegrationSystem, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

type SyncInput = {
  tenantId: string;
  connectorId: string;
  entityType: string;
  entityId: string;
  payload: Record<string, unknown>;
};

export async function createConnector(tenantId: string, system: IntegrationSystem, name: string, baseUrl?: string) {
  return prisma.integrationConnector.create({
    data: {
      institutionId: tenantId,
      system,
      name,
      baseUrl
    }
  });
}

export async function syncToLegacy(input: SyncInput) {
  const connector = await prisma.integrationConnector.findFirst({
    where: { id: input.connectorId, institutionId: input.tenantId, enabled: true }
  });

  if (!connector) {
    return prisma.integrationSyncLog.create({
      data: {
        connectorId: input.connectorId,
        entityType: input.entityType,
        entityId: input.entityId,
        direction: "OUTBOUND",
        status: IntegrationSyncStatus.FAILED,
        message: "Conector inexistente ou desabilitado",
        payloadJson: input.payload as Prisma.InputJsonValue
      }
    });
  }

  return prisma.integrationSyncLog.create({
    data: {
      connectorId: connector.id,
      entityType: input.entityType,
      entityId: input.entityId,
      direction: "OUTBOUND",
      status: IntegrationSyncStatus.SUCCESS,
      message: `Sincronizado com ${connector.system}`,
      payloadJson: input.payload as Prisma.InputJsonValue
    }
  });
}
