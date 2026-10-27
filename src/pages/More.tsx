import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { logout as logoutRequest } from "../api/auth";

function More() {
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
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-[#1E293B] mb-2">More</h1>
      <p className="text-sm text-[#64748B] mb-6">{user?.name || "User"}</p>

      <div className="space-y-3 max-w-md">
        <Link
          to="/categories"
          className="block bg-white border border-[#E9D5FF] rounded-2xl px-4 py-3 text-[#1E293B] font-medium hover:bg-[#F5F3FF]"
        >
          Categories
        </Link>

        {/* Future options can go here:
            - Budgets
            - Settings
            - Profile
        */}

        <button
          onClick={handleLogout}
          className="w-full text-left bg-white border border-[#E9D5FF] rounded-2xl px-4 py-3 text-[#F43F5E] font-medium hover:bg-rose-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default More;
