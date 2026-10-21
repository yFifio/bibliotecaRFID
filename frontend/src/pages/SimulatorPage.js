import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { runSimulation } from "../modules/simulator/simulator.api";
export function SimulatorPage() {
    const [libraryId, setLibraryId] = useState("BIB-CENTRAL");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    async function onRun() {
        setLoading(true);
        try {
            const data = await runSimulation({ libraryId });
            setResult(JSON.stringify(data, null, 2));
        }
        catch (error) {
            setResult(String(error));
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("section", { className: "grid", style: { gap: 20 }, children: [_jsxs("div", { className: "card", children: [_jsx("h2", { children: "Simulador IoT/RFID" }), _jsx("p", { className: "muted", children: "Dispara lote de eventos de totem, smart drop, invent\u00E1rio e portal antifurto." }), _jsxs("label", { children: ["Library ID", _jsx("input", { value: libraryId, onChange: (e) => setLibraryId(e.target.value) })] }), _jsx("div", { style: { marginTop: 12 }, children: _jsx("button", { onClick: onRun, disabled: loading, children: loading ? "Simulando..." : "Executar simulação" }) })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { children: "Sa\u00EDda" }), _jsx("pre", { style: { whiteSpace: "pre-wrap", margin: 0 }, children: result || "Nenhuma execução ainda." })] })] }));
}
