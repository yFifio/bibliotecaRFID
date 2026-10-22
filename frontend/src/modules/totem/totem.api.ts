import { api } from "../../core/api/client";

export type CheckoutPayload = {
  libraryId: string;
  borrowerId: string;
  epcs: string[];
  deviceCode?: string;
};

export function checkout(payload: CheckoutPayload) {
  return api<{ checkoutDurationMs: number; receipt: unknown }>("/self-checkout/batch", {
    method: "POST",
    body: payload
  });
}

export type ReturnPayload = {
  libraryId: string;
  epc: string;
  deviceCode?: string;
};

export function returnBook(payload: ReturnPayload) {
  return api<{ borrowerId: string; fineRemoved: boolean }>("/smart-drops/deposit", {
    method: "POST",
    body: payload
  });
}
