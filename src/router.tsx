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
import Layout from "./components/Layout";

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
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/accounts", element: <Accounts /> },
      { path: "/accounts/create", element: <CreateAccount /> },
      { path: "/accounts/:id/edit", element: <EditAccount /> },
      { path: "/categories", element: <Categories /> },
      { path: "/categories/create", element: <CreateCategory /> },
      { path: "/categories/:id/edit", element: <EditCategory /> },
      { path: "/transactions", element: <Transactions /> },
      { path: "/transactions/create", element: <CreateTransaction /> },
      { path: "/transactions/:id/edit", element: <EditTransaction /> },
    ],
  },
]);

export default router;
