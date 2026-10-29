import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

function Register() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setError(null);

      await api.get("/sanctum/csrf-cookie");
      const res = await api.post("/api/register", data);

      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEFCF8] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#99F6E4] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center font-bold text-lg mb-3">
            FM
          </div>
          <h1 className="text-2xl font-bold text-[#134E4A]">Create account</h1>
          <p className="text-sm text-[#5B7A76] mt-1">
            Start tracking your money
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-[#E11D48] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#134E4A] mb-1">
              Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              placeholder="Your name"
            />
            {errors.name && (
              <p className="text-[#E11D48] text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#134E4A] mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-[#E11D48] text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#134E4A] mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              placeholder="Min 6 characters"
            />
            {errors.password && (
              <p className="text-[#E11D48] text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7C3AED] text-white py-2.5 rounded-lg hover:bg-[#6D28D9] transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-center text-[#5B7A76] mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#7C3AED] font-medium hover:underline"
          >
            Login
          </Link>
        </p>

        <p className="text-sm text-center mt-3">
          <Link to="/" className="text-[#5B7A76] hover:text-[#134E4A]">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
