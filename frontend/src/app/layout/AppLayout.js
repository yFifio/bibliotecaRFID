import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, Outlet } from "react-router-dom";
export function AppLayout() {
    return (_jsxs("div", { className: "app-shell", children: [_jsxs("aside", { className: "sidebar", children: [_jsx("h1", { children: "RFID Library SaaS" }), _jsxs("nav", { children: [_jsx(Link, { to: "/cadastro", children: "1) Cadastrar Conta" }), _jsx(Link, { to: "/totem", children: "Totem Self-Checkout" }), _jsx(Link, { to: "/inventario", children: "App Operacional" }), _jsx(Link, { to: "/gestao", children: "Dashboard Gest\u00E3o" }), _jsx(Link, { to: "/simulador", children: "Simulador IoT" })] })] }), _jsx("main", { className: "content", children: _jsx(Outlet, {}) })] }));
}
