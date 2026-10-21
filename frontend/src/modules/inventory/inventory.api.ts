import { api } from "../../core/api/client";

export function startSession(payload: { libraryId: string; startedByUserId: string; handheldDeviceId?: string }) {
  return api<{ id: string; totalExpected: number }>("/inventory/sessions", { method: "POST", body: payload });
}

export function scanInventory(payload: { sessionId: string; epc: string; detectedShelfId?: string; rssi?: number }) {
  return api<{ progressPct: number; misplacedCount: number; totalRead: number; totalExpected: number; radar: { visual: string; beep: boolean; misplaced: boolean } }>("/inventory/scan", {
    method: "POST",
    body: payload
  });
}

export function finishSession(payload: { sessionId: string }) {
  return api("/inventory/finish", { method: "POST", body: payload });
}
