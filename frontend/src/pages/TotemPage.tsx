import { FormEvent, useState } from "react";
import { checkout } from "../modules/totem/totem.api";

export function TotemPage() {
  const [libraryId, setLibraryId] = useState("BIB-CENTRAL");
  const [borrowerId, setBorrowerId] = useState("");
  const [epcInput, setEpcInput] = useState("EPC-1001,EPC-1002");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
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
    } catch (error) {
      setResponse(String(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid" style={{ gap: 20 }}>
      <div className="card">
        <h2>Totem de Autoatendimento</h2>
        <p className="muted">Empréstimo simultâneo por lote RFID com recibo digital.</p>
        <form className="grid" onSubmit={onSubmit}>
          <label>
            Library ID
            <input value={libraryId} onChange={(e) => setLibraryId(e.target.value)} />
          </label>
          <label>
            Borrower ID
            <input value={borrowerId} onChange={(e) => setBorrowerId(e.target.value)} placeholder="ID do aluno" />
          </label>
          <label>
            EPCs (separados por vírgula)
            <input value={epcInput} onChange={(e) => setEpcInput(e.target.value)} />
          </label>
          <button disabled={loading} type="submit">{loading ? "Processando..." : "Finalizar empréstimo"}</button>
        </form>
      </div>

      <div className="card">
        <h3>Recibo / Resultado</h3>
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{response || "Sem operação ainda."}</pre>
      </div>
    </section>
  );
}
