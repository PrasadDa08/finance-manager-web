import { createBrowserRouter } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Accounts from "./pages/Accounts";
import CreateAccount from "./pages/CreateAccount";
import EditAccount from "./pages/EditAccount";
import Categories from "./pages/Categories";
import CreateCategory from "./pages/CreateCategory";
import EditCategory from "./pages/EditCategory";
import Transactions from "./pages/Transactions";
import CreateTransaction from "./pages/CreateTransaction";
import EditTransaction from "./pages/EditTransaction";

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
  {
    path: "/categories",
    element: (
      <ProtectedRoute>
        <Categories />
      </ProtectedRoute>
    ),
  },
  {
    path: "/categories/create",
    element: (
      <ProtectedRoute>
        <CreateCategory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/categories/:id/edit",
    element: (
      <ProtectedRoute>
        <EditCategory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/transactions",
    element: (
      <ProtectedRoute>
        <Transactions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/transactions/create",
    element: (
      <ProtectedRoute>
        <CreateTransaction />
      </ProtectedRoute>
    ),
  },
  {
    path: "/transactions/:id/edit",
    element: (
      <ProtectedRoute>
        <EditTransaction />
      </ProtectedRoute>
    ),
  },
]);

export default router;
