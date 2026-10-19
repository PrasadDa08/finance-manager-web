import { useAuthStore } from "../store/authStore";
import { logout as logoutRequest } from "../api/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      console.log("Logout Error: ", error);
    } finally {
      logout();
      navigate("/login");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F3FF]">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-[#E9D5FF] text-center">
        <h1 className="text-3xl font-bold text-[#1E293B] mb-4">Dashboard</h1>
        <p className="text-[#64748B] mb-2">Welcome, {user?.name || "User"}</p>
        <p className="text-[#64748B]">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6D28D9] transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
