import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchDashboard } from "../modules/management/management.api";

export function ManagementPage() {
  const [libraryId, setLibraryId] = useState("BIB-CENTRAL");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["dashboard", libraryId],
    queryFn: () => fetchDashboard(libraryId)
  });

  return (
    <section className="grid" style={{ gap: 20 }}>
      <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12 }}>
        <div>
          <h2>Painel de gestão</h2>
          <p className="muted">Mapa de calor, ranking de leitura e alertas antifurto.</p>
        </div>
        <div style={{ minWidth: 220 }}>
          <label>
            Código da biblioteca
            <input value={libraryId} onChange={(e) => setLibraryId(e.target.value)} />
          </label>
          <button style={{ marginTop: 10 }} onClick={() => refetch()}>Atualizar</button>
        </div>
      </div>

      {isLoading ? (
        <div className="card">Carregando...</div>
      ) : (
        <>
          <div className="grid grid-3">
            <div className="card">
              <div className="muted">Empréstimos em aberto</div>
              <div className="kpi">{data?.kpis.openLoans ?? 0}</div>
            </div>
            <div className="card">
              <div className="muted">Tentativas de furto hoje</div>
              <div className="kpi">{data?.kpis.theftAttempts ?? 0}</div>
            </div>
            <div className="card">
              <div className="muted">Horas economizadas</div>
              <div className="kpi">{data?.kpis.savedWorkHours ?? 0}h</div>
            </div>
          </div>

          <div className="grid grid-2">
            <div className="card">
              <h3>Mapa de calor por seção</h3>
              <ul>
                {data?.heatmap.sections.map((section) => (
                  <li key={section.code}>
                    Seção {section.code}: {Math.round(section.intensity * 100)}%
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3>Ranking de títulos mais lidos</h3>
              <ol>
                {data?.topBooks.map((book) => (
                  <li key={book.title}>
                    {book.title} ({book.loansCount})
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="card">
            <h3>Log de alertas</h3>
            <ul>
              {data?.alerts.map((alert) => (
                <li key={alert.id}>
                  [{alert.severity}] {alert.title}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}
