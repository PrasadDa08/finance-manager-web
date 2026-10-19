import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { user as getUser } from "../api/auth";

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await getUser();
        setUser(response.data.user);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [setUser, logout]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F3FF]">
        <p className="text-[#64748B]">Loading...</p>
      </div>
    );
  }

  return children;
}

export default AuthProvider;
