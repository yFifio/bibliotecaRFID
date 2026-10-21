import { api } from "../../core/api/client";

type RegisterPayload = {
  institutionTaxId: string;
  libraryCode: string;
  fullName: string;
  email: string;
  role: "STUDENT" | "RESEARCHER" | "LIBRARIAN" | "ATTENDANT" | "MANAGER" | "ADMIN";
  cardUid?: string;
};

export function registerAccount(payload: RegisterPayload) {
  return api<{
    created: boolean;
    message: string;
    account: { userId: string; fullName: string; email: string; role: string };
    context: { tenantId: string; libraryId: string; libraryCode: string };
  }>("/onboarding/register", {
    method: "POST",
    body: payload
  });
}

export function getOnboardingHelp() {
  return api<{ quickSteps: string[]; defaultSeed: { institutionTaxId: string; libraryCode: string } }>("/onboarding/help");
}
