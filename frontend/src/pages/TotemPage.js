import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { checkout } from "../modules/totem/totem.api";
export function TotemPage() {
    const [libraryId, setLibraryId] = useState("BIB-CENTRAL");
    const [borrowerId, setBorrowerId] = useState("");
    const [epcInput, setEpcInput] = useState("EPC-1001,EPC-1002");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await checkout({
                libraryId,
                borrowerId,
                epcs: epcInput.split(",").map((item) => item.trim()).filter(Boolean),
                deviceCode: "KIOSK-01"
            });
            setResponse(JSON.stringify(result, null, 2));
        }
        catch (error) {
            setResponse(String(error));
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("section", { className: "grid", style: { gap: 20 }, children: [_jsxs("div", { className: "card", children: [_jsx("h2", { children: "Totem de Autoatendimento" }), _jsx("p", { className: "muted", children: "Empr\u00E9stimo simult\u00E2neo por lote RFID com recibo digital." }), _jsxs("form", { className: "grid", onSubmit: onSubmit, children: [_jsxs("label", { children: ["Library ID", _jsx("input", { value: libraryId, onChange: (e) => setLibraryId(e.target.value) })] }), _jsxs("label", { children: ["Borrower ID", _jsx("input", { value: borrowerId, onChange: (e) => setBorrowerId(e.target.value), placeholder: "ID do aluno" })] }), _jsxs("label", { children: ["EPCs (separados por v\u00EDrgula)", _jsx("input", { value: epcInput, onChange: (e) => setEpcInput(e.target.value) })] }), _jsx("button", { disabled: loading, type: "submit", children: loading ? "Processando..." : "Finalizar empréstimo" })] })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { children: "Recibo / Resultado" }), _jsx("pre", { style: { whiteSpace: "pre-wrap", margin: 0 }, children: response || "Sem operação ainda." })] })] }));
}
