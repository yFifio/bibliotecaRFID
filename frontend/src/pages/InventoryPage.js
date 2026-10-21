import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { finishSession, scanInventory, startSession } from "../modules/inventory/inventory.api";
export function InventoryPage() {
    const [libraryId, setLibraryId] = useState("BIB-CENTRAL");
    const [operatorId, setOperatorId] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [epc, setEpc] = useState("EPC-1002");
    const [shelfId, setShelfId] = useState("");
    const [result, setResult] = useState("");
    async function openSession() {
        const session = await startSession({
            libraryId,
            startedByUserId: operatorId,
            handheldDeviceId: "HANDHELD-01"
        });
        setSessionId(session.id);
        setResult(JSON.stringify(session, null, 2));
    }
    async function scan() {
        const scanResult = await scanInventory({
            sessionId,
            epc,
            detectedShelfId: shelfId || undefined,
            rssi: -42
        });
        setResult(JSON.stringify(scanResult, null, 2));
    }
    async function close() {
        const response = await finishSession({ sessionId });
        setResult(JSON.stringify(response, null, 2));
    }
    return (_jsxs("section", { className: "grid", style: { gap: 20 }, children: [_jsxs("div", { className: "card", children: [_jsx("h2", { children: "App Operacional / Invent\u00E1rio" }), _jsx("p", { className: "muted", children: "Modo bast\u00E3o com progresso em tempo real e radar visual/sonoro." }), _jsxs("div", { className: "grid grid-2", children: [_jsxs("label", { children: ["Library ID", _jsx("input", { value: libraryId, onChange: (e) => setLibraryId(e.target.value) })] }), _jsxs("label", { children: ["Operador (User ID)", _jsx("input", { value: operatorId, onChange: (e) => setOperatorId(e.target.value), placeholder: "ID do bibliotec\u00E1rio" })] })] }), _jsxs("div", { style: { display: "flex", gap: 8, marginTop: 12 }, children: [_jsx("button", { onClick: openSession, children: "Iniciar sess\u00E3o" }), _jsx("button", { onClick: close, disabled: !sessionId, children: "Encerrar sess\u00E3o" })] }), _jsxs("p", { className: "muted", children: ["Sess\u00E3o atual: ", sessionId || "não iniciada"] })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { children: "Scanner RFID" }), _jsxs("div", { className: "grid grid-2", children: [_jsxs("label", { children: ["EPC", _jsx("input", { value: epc, onChange: (e) => setEpc(e.target.value) })] }), _jsxs("label", { children: ["Shelf detectada", _jsx("input", { value: shelfId, onChange: (e) => setShelfId(e.target.value), placeholder: "Opcional" })] })] }), _jsx("div", { style: { marginTop: 12 }, children: _jsx("button", { onClick: scan, disabled: !sessionId, children: "Ler com bast\u00E3o" }) })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { children: "Resultado" }), _jsx("pre", { style: { whiteSpace: "pre-wrap", margin: 0 }, children: result || "Sem leituras ainda." })] })] }));
}
