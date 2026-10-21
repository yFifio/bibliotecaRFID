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
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/cadastro" replace /> },
      { path: "cadastro", element: <OnboardingPage /> },
      { path: "totem", element: <TotemPage /> },
      { path: "inventario", element: <InventoryPage /> },
      { path: "gestao", element: <ManagementPage /> },
      { path: "simulador", element: <SimulatorPage /> }
    ]
  }
]);
