import { api } from "../../core/api/client";
export function fetchDashboard(libraryId) {
    return api(`/analytics/dashboard?libraryId=${libraryId}`);
}
