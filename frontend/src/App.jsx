import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import AppLayout from "./components/layout/AppLayout";

import Overview from "./pages/Overview";
import PostalPerformance from "./pages/PostalPerformance";
import DeliveryAnalytics from "./pages/DeliveryAnalytics";
import PostOfficeMonitoring from "./pages/PostOfficeMonitoring";
import DelayPredictions from "./pages/DelayPredictions";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="performance" element={<PostalPerformance />} />
              <Route path="delivery-analytics" element={<DeliveryAnalytics />} />
              <Route path="offices" element={<PostOfficeMonitoring />} />
              <Route path="predictions" element={<DelayPredictions />} />
              <Route path="reports" element={<Reports />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
