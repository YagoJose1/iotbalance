import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import LocationsPage from "./pages/locations/LocationsPage";
import ZonesPage from "./pages/zones/ZonesPage";
import DevicesPage from "./pages/devices/DevicesPage";
import DeviceDetailPage from "./pages/devices/DeviceDetailPage";
import ProductsPage from "./pages/products/ProductsPage";
import ReportsPage from "./pages/reports/ReportsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="locations" element={<LocationsPage />} />
              <Route path="zones" element={<ZonesPage />} />
              <Route path="devices" element={<DevicesPage />} />
              <Route path="devices/:id" element={<DeviceDetailPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
