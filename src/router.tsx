import { createBrowserRouter } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Accounts from "./pages/Accounts";
import CreateAccount from "./pages/CreateAccount";
import EditAccount from "./pages/EditAccount";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/accounts",
    element: (
      <ProtectedRoute>
        <Accounts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/accounts/create",
    element: (
      <ProtectedRoute>
        <CreateAccount />
      </ProtectedRoute>
    ),
  },
  {
    path: "/accounts/:id/edit",
    element: (
      <ProtectedRoute>
        <EditAccount />
      </ProtectedRoute>
    ),
  },
]);

export default router;
