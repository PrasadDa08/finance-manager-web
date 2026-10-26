import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { logout as logoutRequest } from "../api/auth";

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

  return (
    <div className="min-h-screen bg-[#F5F3FF]">
      <header className="bg-white border-b border-[#E9D5FF]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-[#7C3AED]">Finance Manager</h1>

          <nav className="flex flex-wrap gap-4 text-sm font-medium text-[#1E293B]">
            <Link to="/dashboard" className="hover:text-[#7C3AED]">
              Dashboard
            </Link>
            <Link to="/accounts" className="hover:text-[#7C3AED]">
              Accounts
            </Link>
            <Link to="/categories" className="hover:text-[#7C3AED]">
              Categories
            </Link>
            <Link to="/transactions" className="hover:text-[#7C3AED]">
              Transactions
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-sm text-[#64748B]">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-[#F43F5E] hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
