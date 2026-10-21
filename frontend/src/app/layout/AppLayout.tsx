import { Link, Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>RFID Library SaaS</h1>
        <nav>
          <Link to="/cadastro">1) Cadastrar Conta</Link>
          <Link to="/totem">Totem Self-Checkout</Link>
          <Link to="/inventario">App Operacional</Link>
          <Link to="/gestao">Dashboard Gestão</Link>
          <Link to="/simulador">Simulador IoT</Link>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
