import { api } from "../../core/api/client";
export function startSession(payload) {
    return api("/inventory/sessions", { method: "POST", body: payload });
}
export function scanInventory(payload) {
    return api("/inventory/scan", {
        method: "POST",
        body: payload
    });
}
export function finishSession(payload) {
    return api("/inventory/finish", { method: "POST", body: payload });
}
