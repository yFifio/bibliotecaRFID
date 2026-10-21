const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3333/api/v1";
const TENANT_ID = import.meta.env.VITE_TENANT_ID ?? "TENANT_DEMO";
const LIBRARY_ID = import.meta.env.VITE_LIBRARY_ID ?? "";
const STORAGE_KEY = "rfid-session-context";
export function setSessionContext(context) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
}
export function getSessionContext() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
export async function api(path, options = {}) {
    const sessionContext = getSessionContext();
    const tenantHeader = sessionContext?.tenantId ?? TENANT_ID;
    const libraryHeader = sessionContext?.libraryId ?? LIBRARY_ID;
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: options.method ?? "GET",
        headers: {
            "content-type": "application/json",
            "x-tenant-id": tenantHeader,
            ...(libraryHeader ? { "x-library-id": libraryHeader } : {})
        },
        body: options.body ? JSON.stringify(options.body) : undefined
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error ?? "Erro de API");
    }
    return response.json();
}
