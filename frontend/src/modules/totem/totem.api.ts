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
