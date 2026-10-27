import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { logout as logoutRequest } from "../api/auth";
import Toast from "./Toast";

function Layout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.log(error);
    } finally {
      logout();
      navigate("/login");
    }
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
      isActive
        ? "bg-[#F5F3FF] text-[#7C3AED]"
        : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]"
    }`;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-[#E9D5FF]">
        <div className="p-5 border-b border-[#E9D5FF]">
          <div className="flex items-center gap-3">
            {/* Logo placeholder */}
            <div className="w-10 h-10 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center font-bold">
              FM
            </div>
            <div>
              <p className="font-bold text-[#1E293B]">Finance Manager</p>
              <p className="text-xs text-[#64748B]">Your money, clearly</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/dashboard" className={linkClass}>
            <DashboardIcon />
            Dashboard
          </NavLink>
          <NavLink to="/accounts" className={linkClass}>
            <AccountsIcon />
            Accounts
          </NavLink>
          <NavLink to="/categories" className={linkClass}>
            <CategoriesIcon />
            Categories
          </NavLink>
          <NavLink to="/transactions" className={linkClass}>
            <TransactionsIcon />
            Transactions
          </NavLink>
        </nav>

        <div className="p-4 border-t border-[#E9D5FF]">
          <p className="text-sm text-[#1E293B] font-medium mb-2">
            {user?.name || "User"}
          </p>
          <button
            onClick={handleLogout}
            className="text-sm text-[#F43F5E] hover:underline"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-40 bg-white border-b border-[#E9D5FF] px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center text-sm font-bold">
            FM
          </div>
          <p className="font-bold text-[#1E293B]">Finance Manager</p>
        </header>

        <main className="pb-12 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E9D5FF]">
        <div className="grid grid-cols-5 h-16">
          <BottomLink to="/dashboard" label="Home" icon={<DashboardIcon />} />
          <BottomLink to="/accounts" label="Accounts" icon={<AccountsIcon />} />

          <Link
            to="/transactions/create"
            className="flex flex-col items-center justify-center -mt-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shadow-lg">
              <PlusIcon />
            </div>
          </Link>

          <BottomLink
            to="/transactions"
            label="Txns"
            icon={<TransactionsIcon />}
          />
          <BottomLink to="/more" label="More" icon={<CategoriesIcon />} />
        </div>
      </nav>

      <Toast />
    </div>
  );
}

function BottomLink({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-1 text-[11px] ${
          isActive ? "text-[#7C3AED]" : "text-[#64748B]"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}


function DashboardIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z" />
    </svg>
  );
}

function AccountsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function CategoriesIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  );
}

function TransactionsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default Layout;
