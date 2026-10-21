import { IoTEventSource, IoTEventType, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

type EventInput = {
  tenantId: string;
  libraryId?: string;
  deviceId?: string;
  eventType: IoTEventType;
  source: IoTEventSource;
  epc?: string;
  payloadJson: Record<string, unknown>;
};

export async function ingestIotEvent(input: EventInput) {
  return prisma.ioTEvent.create({
    data: {
      institutionId: input.tenantId,
      libraryId: input.libraryId,
      deviceId: input.deviceId,
      eventType: input.eventType,
      source: input.source,
      epc: input.epc,
      payloadJson: input.payloadJson as Prisma.InputJsonValue,
      occurredAt: new Date(),
      processedAt: new Date()
    }
  });
}

export async function listIotEvents(tenantId: string, limit = 50) {
  return prisma.ioTEvent.findMany({
    where: { institutionId: tenantId },
    orderBy: { occurredAt: "desc" },
    take: limit
  });
}
