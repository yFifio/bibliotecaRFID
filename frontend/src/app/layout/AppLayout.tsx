import { NavLink, Outlet } from "react-router-dom";
import { QuickSimulatorDrawer } from "./QuickSimulatorDrawer";

type NavigationIconName = "book" | "inventory" | "dashboard" | "settings" | "simulator";

function NavigationIcon({ name }: { name: NavigationIconName }) {
  const paths: Record<NavigationIconName, string> = {
    book: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16ZM4 17a2.5 2.5 0 0 1 2.5-2.5H20",
    inventory: "M4 4h16v16H4zM8 8h8M8 12h8M8 16h5",
    dashboard: "M4 19V5M4 19h16M8 15l3-4 3 2 5-7",
    settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 2.94-.09-.03a1.7 1.7 0 0 0-1.76.47l-.06.07h-3.4l-.02-.1a1.7 1.7 0 0 0-1.19-1.3l-.1-.03-1.7-2.94.07-.07A1.7 1.7 0 0 0 10.2 14l-.1-.06v-3.4l.1-.02a1.7 1.7 0 0 0 1.3-1.19l.03-.1 2.94-1.7.07.07a1.7 1.7 0 0 0 1.88.34l.06-.06 2.94 1.7-.03.09a1.7 1.7 0 0 0 .47 1.76l.07.06v3.4l-.1.02A1.7 1.7 0 0 0 19.4 15Z",
    simulator: "M9 3h6M10 3v6l-5.2 8.2A2.5 2.5 0 0 0 6.9 21h10.2a2.5 2.5 0 0 0 2.1-3.8L14 9V3M8 15h8"
  };

  return (
    <svg aria-hidden="true" className="navigation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
}

const navigationSections: {
  title: string;
  links: { to: string; label: string; icon: NavigationIconName }[];
}[] = [
  {
    title: "Autoatendimento",
    links: [{ to: "/totem", label: "Totem", icon: "book" }]
  },
  {
    title: "Operação",
    links: [
      { to: "/inventario", label: "Inventário", icon: "inventory" },
      { to: "/gestao", label: "Gestão", icon: "dashboard" }
    ]
  },
  {
    title: "Configuração e testes",
    links: [
      { to: "/cadastro", label: "Cadastro inicial", icon: "settings" },
      { to: "/simulador", label: "Simulador RFID", icon: "simulator" }
    ]
  }
];

export function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark" aria-hidden="true">R</span>
          <div>
            <h1>Biblioteca RFID</h1>
            <p>Plataforma de gestão</p>
          </div>
        </div>
        <nav className="sidebar-navigation" aria-label="Navegação principal">
          {navigationSections.map((section) => (
            <section className="navigation-section" key={section.title}>
              <h2>{section.title}</h2>
              <div className="navigation-links">
                {section.links.map((link) => (
                  <NavLink
                    className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
                    key={link.to}
                    to={link.to}
                  >
                    <NavigationIcon name={link.icon} />
                    <span>{link.label}</span>
                    <span className="navigation-active-indicator" aria-hidden="true" />
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
      <QuickSimulatorDrawer />
    </div>
  );
}
