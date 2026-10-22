import { useState } from "react";
import { finishSession, scanInventory, startSession } from "../modules/inventory/inventory.api";

export function InventoryPage() {
  const [libraryId, setLibraryId] = useState("BIB-CENTRAL");
  const [operatorId, setOperatorId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [epc, setEpc] = useState("EPC-1002");
  const [shelfId, setShelfId] = useState("");
  const [result, setResult] = useState<string>("");

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

  return (
    <section className="grid" style={{ gap: 20 }}>
      <div className="card">
        <h2>Operação de inventário</h2>
        <p className="muted">Modo bastão com progresso em tempo real e radar visual/sonoro.</p>
        <div className="grid grid-2">
          <label>
            Código da biblioteca
            <input value={libraryId} onChange={(e) => setLibraryId(e.target.value)} />
          </label>
          <label>
            Identificação do operador
            <input value={operatorId} onChange={(e) => setOperatorId(e.target.value)} placeholder="ID do bibliotecário" />
          </label>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={openSession}>Iniciar sessão</button>
          <button onClick={close} disabled={!sessionId}>Encerrar sessão</button>
        </div>
        <p className="muted">Sessão atual: {sessionId || "não iniciada"}</p>
      </div>

      <div className="card">
        <h3>Scanner RFID</h3>
        <div className="grid grid-2">
          <label>
            EPC
            <input value={epc} onChange={(e) => setEpc(e.target.value)} />
          </label>
          <label>
            Prateleira detectada
            <input value={shelfId} onChange={(e) => setShelfId(e.target.value)} placeholder="Opcional" />
          </label>
        </div>
        <div style={{ marginTop: 12 }}>
          <button onClick={scan} disabled={!sessionId}>Ler com bastão</button>
        </div>
      </div>

      <div className="card">
        <h3>Resultado</h3>
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{result || "Sem leituras ainda."}</pre>
      </div>
    </section>
  );
}
