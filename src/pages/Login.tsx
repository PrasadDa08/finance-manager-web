import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { getCsrfCookie, login, user } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError(null);

      await getCsrfCookie();

      await login(data);

      const userResponse = await user();
      setUser(userResponse.data.user);
      console.log("Logged in user:", userResponse.data);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F3FF]">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-[#E9D5FF]">
        <h1 className="text-3xl font-bold mb-2 text-center text-[#1E293B]">
          Welcome Back
        </h1>
        <p className="text-center text-[#64748B] mb-6">
          Login to manage your finances
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-100 text-[#F43F5E] rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-[#1E293B]">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full border border-[#E9D5FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-[#F43F5E] text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#1E293B]">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full border border-[#E9D5FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-[#F43F5E] text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7C3AED] text-white py-2.5 rounded-lg hover:bg-[#6D28D9] transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-[#64748B] mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#7C3AED] font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
