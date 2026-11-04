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
import More from "./pages/More";
import Landing from "./pages/Landing";
import Budgets from "./pages/Budgets";
import CreateBudget from "./pages/CreateBudget";
import EditBudget from "./pages/EditBudget";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
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
      { path: "/more", element: <More /> },
      { path: "/budgets", element: <Budgets /> },
      { path: "/budgets/create", element: <CreateBudget /> },
      { path: "/budgets/:id/edit", element: <EditBudget /> },
    ],
  },
]);
export default router;
