import { api } from "../../core/api/client";
export function registerAccount(payload) {
    return api("/onboarding/register", {
        method: "POST",
        body: payload
    });
}
export function getOnboardingHelp() {
    return api("/onboarding/help");
}
