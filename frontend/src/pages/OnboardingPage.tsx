import { FormEvent, useEffect, useState } from "react";
import { getSessionContext, setSessionContext } from "../core/api/client";
import { getOnboardingHelp, registerAccount } from "../modules/onboarding/onboarding.api";

export function OnboardingPage() {
  const [institutionTaxId, setInstitutionTaxId] = useState("00.000.000/0001-00");
  const [libraryCode, setLibraryCode] = useState("BIB-CENTRAL");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"STUDENT" | "RESEARCHER" | "LIBRARIAN" | "ATTENDANT" | "MANAGER" | "ADMIN">("STUDENT");
  const [response, setResponse] = useState<string>("");
  const [steps, setSteps] = useState<string[]>([]);
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

  async function onSubmit(event: FormEvent) {
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

      setResponse(
        [
          result.message,
          `User ID: ${result.account.userId}`,
          `Tenant ID: ${result.context.tenantId}`,
          `Library ID: ${result.context.libraryId}`,
          "Pronto: os IDs já foram salvos automaticamente no navegador."
        ].join("\n")
      );
    } catch (error) {
      setResponse(String(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid" style={{ gap: 20 }}>
      <div className="card">
        <h2>Cadastro de Conta (rápido)</h2>
        <p className="muted">Preencha este formulário uma vez. O sistema salva os IDs automaticamente.</p>
        <form className="grid" onSubmit={onSubmit}>
          <label>
            CNPJ / TaxId da Instituição
            <input value={institutionTaxId} onChange={(e) => setInstitutionTaxId(e.target.value)} />
          </label>
          <label>
            Código da Biblioteca
            <input value={libraryCode} onChange={(e) => setLibraryCode(e.target.value)} />
          </label>
          <label>
            Nome completo
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ex: Lucas Silva" />
          </label>
          <label>
            E-mail
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" />
          </label>
          <label>
            Perfil
            <select value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
              <option value="STUDENT">Aluno</option>
              <option value="RESEARCHER">Pesquisador</option>
              <option value="LIBRARIAN">Bibliotecário</option>
              <option value="ATTENDANT">Atendente</option>
              <option value="MANAGER">Gestor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
          <button disabled={loading} type="submit">
            {loading ? "Cadastrando..." : "Cadastrar conta"}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Passo a passo</h3>
        <ol>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="card">
        <h3>Resultado</h3>
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{response || "Faça o cadastro para começar."}</pre>
      </div>
    </section>
  );
}
