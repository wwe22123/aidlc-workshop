import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Customer pages
import LoginPage from './customer/pages/LoginPage';
import MenuPage from './customer/pages/MenuPage';
import OrderConfirmPage from './customer/pages/OrderConfirmPage';
import OrderSuccessPage from './customer/pages/OrderSuccessPage';
import OrderHistoryPage from './customer/pages/OrderHistoryPage';

// Admin pages
import AdminLoginPage from './admin/pages/AdminLoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import TableManagePage from './admin/pages/TableManagePage';
import MenuManagePage from './admin/pages/MenuManagePage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Customer */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/order/confirm" element={<OrderConfirmPage />} />
        <Route path="/order/success" element={<OrderSuccessPage />} />
        <Route path="/order/history" element={<OrderHistoryPage />} />
        <Route path="/" element={<Navigate to="/menu" replace />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/tables" element={<TableManagePage />} />
        <Route path="/admin/menus" element={<MenuManagePage />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
