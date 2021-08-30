import { useContext } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from './pages/Dashboard';
import CheckInPage from "./pages/CheckInPage";
import CheckOutPage from "./pages/CheckOutPage";
import { AuthContext } from './context/auth-context';
import LoginPage from './pages/LoginPage';

export default function Router() {
  const auth = useContext(AuthContext);

  return useRoutes([
    {
      path: "app",
      element: auth.isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "checkin", element: <CheckInPage /> },
        { path: "checkout", element: <CheckOutPage /> },
      ],
    },
    {
      path: "/login", element: <LoginPage />
    },
    {
      path: "/", element: <Navigate to="/app/dashboard" /> 
    },
    {
      path: "*", element: <Navigate to="/app/dashboard" /> 
    },
  ]);
};
