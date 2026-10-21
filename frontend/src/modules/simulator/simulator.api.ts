import { api } from "../../core/api/client";

export function runSimulation(payload: { libraryId: string }) {
  return api<{ ok: boolean; message?: string }>("/simulator/run", {
    method: "POST",
    body: payload
  });
}
