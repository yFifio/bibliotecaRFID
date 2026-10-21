import { api } from "../../core/api/client";
export function runSimulation(payload) {
    return api("/simulator/run", {
        method: "POST",
        body: payload
    });
}
