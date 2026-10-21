import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { TotemPage } from "../pages/TotemPage";
import { InventoryPage } from "../pages/InventoryPage";
import { ManagementPage } from "../pages/ManagementPage";
import { SimulatorPage } from "../pages/SimulatorPage";
import { OnboardingPage } from "../pages/OnboardingPage";
export const router = createBrowserRouter([
    {
        path: "/",
        element: _jsx(AppLayout, {}),
        children: [
            { index: true, element: _jsx(Navigate, { to: "/cadastro", replace: true }) },
            { path: "cadastro", element: _jsx(OnboardingPage, {}) },
            { path: "totem", element: _jsx(TotemPage, {}) },
            { path: "inventario", element: _jsx(InventoryPage, {}) },
            { path: "gestao", element: _jsx(ManagementPage, {}) },
            { path: "simulador", element: _jsx(SimulatorPage, {}) }
        ]
    }
]);
