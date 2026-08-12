import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { InventoryPage } from "./pages/InventoryPage";
import { BarcodeScannerPage } from "./pages/BarcodeScannerPage";
import { POSPage } from "./pages/POSPage";
import { ExpiryTrackingPage } from "./pages/ExpiryTrackingPage";
import { SmartDiscountsPage } from "./pages/SmartDiscountsPage";
import { DemandForecastPage } from "./pages/DemandForecastPage";
import { SmartReorderPage } from "./pages/SmartReorderPage";
import { SuppliersPage } from "./pages/SuppliersPage";
import { WasteSustainabilityPage } from "./pages/WasteSustainabilityPage";
import { SurplusExchangePage } from "./pages/SurplusExchangePage";
import { CustomerDealsFeedPage } from "./pages/CustomerDealsFeedPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400 font-bold text-sm">
        Authenticating EcoStock Session...
      </div>
    );
  }
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/deals-public" element={<CustomerDealsFeedPage />} />

          {/* Protected Store Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="products" element={<InventoryPage />} />
            <Route path="scan" element={<BarcodeScannerPage />} />
            <Route path="pos" element={<POSPage />} />
            <Route path="expiry" element={<ExpiryTrackingPage />} />
            <Route path="discounts" element={<SmartDiscountsPage />} />
            <Route path="forecast" element={<DemandForecastPage />} />
            <Route path="reorders" element={<SmartReorderPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="waste" element={<WasteSustainabilityPage />} />
            <Route path="exchange" element={<SurplusExchangePage />} />
            <Route path="deals" element={<CustomerDealsFeedPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
