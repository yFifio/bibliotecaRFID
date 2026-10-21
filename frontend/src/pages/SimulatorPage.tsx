import { useState } from "react";
import { runSimulation } from "../modules/simulator/simulator.api";

export function SimulatorPage() {
  const [libraryId, setLibraryId] = useState("BIB-CENTRAL");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function onRun() {
    setLoading(true);
    try {
      const data = await runSimulation({ libraryId });
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(String(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid" style={{ gap: 20 }}>
      <div className="card">
        <h2>Simulador IoT/RFID</h2>
        <p className="muted">Dispara lote de eventos de totem, smart drop, inventário e portal antifurto.</p>
        <label>
          Library ID
          <input value={libraryId} onChange={(e) => setLibraryId(e.target.value)} />
        </label>
        <div style={{ marginTop: 12 }}>
          <button onClick={onRun} disabled={loading}>{loading ? "Simulando..." : "Executar simulação"}</button>
        </div>
      </div>

      <div className="card">
        <h3>Saída</h3>
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{result || "Nenhuma execução ainda."}</pre>
      </div>
    </section>
  );
}
