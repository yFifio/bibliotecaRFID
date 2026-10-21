import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getSessionContext, setSessionContext } from "../core/api/client";
import { getOnboardingHelp, registerAccount } from "../modules/onboarding/onboarding.api";
export function OnboardingPage() {
    const [institutionTaxId, setInstitutionTaxId] = useState("00.000.000/0001-00");
    const [libraryCode, setLibraryCode] = useState("BIB-CENTRAL");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("STUDENT");
    const [response, setResponse] = useState("");
    const [steps, setSteps] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getOnboardingHelp()
            .then((help) => setSteps(help.quickSteps))
            .catch(() => setSteps([]));
        const existingContext = getSessionContext();
        if (existingContext) {
            setResponse(`Contexto já salvo no navegador:\nTenant: ${existingContext.tenantId}\nLibrary: ${existingContext.libraryId}`);
        }
    }, []);
    async function onSubmit(event) {
        event.preventDefault();
        setLoading(true);
        try {
            const result = await registerAccount({
                institutionTaxId,
                libraryCode,
                fullName,
                email,
                role
            });
            setSessionContext({
                tenantId: result.context.tenantId,
                libraryId: result.context.libraryId
            });
            setResponse([
                result.message,
                `User ID: ${result.account.userId}`,
                `Tenant ID: ${result.context.tenantId}`,
                `Library ID: ${result.context.libraryId}`,
                "Pronto: os IDs já foram salvos automaticamente no navegador."
            ].join("\n"));
        }
        catch (error) {
            setResponse(String(error));
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("section", { className: "grid", style: { gap: 20 }, children: [_jsxs("div", { className: "card", children: [_jsx("h2", { children: "Cadastro de Conta (r\u00E1pido)" }), _jsx("p", { className: "muted", children: "Preencha este formul\u00E1rio uma vez. O sistema salva os IDs automaticamente." }), _jsxs("form", { className: "grid", onSubmit: onSubmit, children: [_jsxs("label", { children: ["CNPJ / TaxId da Institui\u00E7\u00E3o", _jsx("input", { value: institutionTaxId, onChange: (e) => setInstitutionTaxId(e.target.value) })] }), _jsxs("label", { children: ["C\u00F3digo da Biblioteca", _jsx("input", { value: libraryCode, onChange: (e) => setLibraryCode(e.target.value) })] }), _jsxs("label", { children: ["Nome completo", _jsx("input", { value: fullName, onChange: (e) => setFullName(e.target.value), placeholder: "Ex: Lucas Silva" })] }), _jsxs("label", { children: ["E-mail", _jsx("input", { value: email, onChange: (e) => setEmail(e.target.value), placeholder: "voce@exemplo.com" })] }), _jsxs("label", { children: ["Perfil", _jsxs("select", { value: role, onChange: (e) => setRole(e.target.value), children: [_jsx("option", { value: "STUDENT", children: "Aluno" }), _jsx("option", { value: "RESEARCHER", children: "Pesquisador" }), _jsx("option", { value: "LIBRARIAN", children: "Bibliotec\u00E1rio" }), _jsx("option", { value: "ATTENDANT", children: "Atendente" }), _jsx("option", { value: "MANAGER", children: "Gestor" }), _jsx("option", { value: "ADMIN", children: "Admin" })] })] }), _jsx("button", { disabled: loading, type: "submit", children: loading ? "Cadastrando..." : "Cadastrar conta" })] })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { children: "Passo a passo" }), _jsx("ol", { children: steps.map((step) => (_jsx("li", { children: step }, step))) })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { children: "Resultado" }), _jsx("pre", { style: { whiteSpace: "pre-wrap", margin: 0 }, children: response || "Faça o cadastro para começar." })] })] }));
}
