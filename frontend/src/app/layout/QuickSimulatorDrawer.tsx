import { FormEvent, useState } from "react";
import { getSessionContext } from "../../core/api/client";
import { runSimulation } from "../../modules/simulator/simulator.api";

export function QuickSimulatorDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [libraryId, setLibraryId] = useState(
    () => getSessionContext()?.libraryId || "BIB-CENTRAL"
  );
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsRunning(true);
    setFeedback("");

    try {
      const result = await runSimulation({ libraryId: libraryId.trim() });
      setFeedback(
        result.message ||
          (result.ok
            ? "Eventos RFID simulados com sucesso."
            : "A API não confirmou a simulação.")
      );
    } catch (error) {
      setFeedback(`Não foi possível executar a simulação: ${String(error)}`);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="quick-simulator">
      <aside
        className="quick-simulator-panel"
        hidden={!isOpen}
        id="quick-simulator-panel"
        aria-label="Simulador rápido RFID"
      >
        <div className="quick-simulator-heading">
          <div>
            <p className="quick-simulator-eyebrow">Ação rápida</p>
            <h2>Simulador RFID</h2>
          </div>
          <button
            aria-label="Fechar simulador rápido"
            className="quick-simulator-close"
            onClick={() => setIsOpen(false)}
            type="button"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <p className="quick-simulator-description">
          Dispare um lote de eventos RFID sem sair desta página.
        </p>
        <form className="quick-simulator-form" onSubmit={handleSubmit}>
          <label htmlFor="quick-simulator-library">Código da biblioteca</label>
          <input
            autoComplete="off"
            id="quick-simulator-library"
            onChange={(event) => setLibraryId(event.target.value)}
            required
            value={libraryId}
          />
          <button disabled={isRunning || !libraryId.trim()} type="submit">
            {isRunning ? "Simulando eventos..." : "Disparar eventos RFID"}
          </button>
        </form>
        <p aria-live="polite" className="quick-simulator-feedback" role="status">
          {feedback || "A execução não altera a página atual."}
        </p>
      </aside>
      <button
        aria-controls="quick-simulator-panel"
        aria-expanded={isOpen}
        className={`quick-simulator-trigger${isOpen ? " is-open" : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3h6M10 3v6l-5.2 8.2A2.5 2.5 0 0 0 6.9 21h10.2a2.5 2.5 0 0 0 2.1-3.8L14 9V3M8 15h8" />
        </svg>
        <span>{isOpen ? "Fechar simulador" : "Simulador rápido"}</span>
      </button>
    </div>
  );
}
