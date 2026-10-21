import { api } from "../../core/api/client";
export function checkout(payload) {
    return api("/self-checkout/batch", {
        method: "POST",
        body: payload
    });
}
