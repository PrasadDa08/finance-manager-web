import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "../api/auth";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type FormData = z.infer<typeof schema>;

function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = useMemo(() => params.get("email") || "", [params]);
  const token = useMemo(() => params.get("token") || "", [params]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!email || !token) {
      setError("Invalid reset link");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await resetPassword({
        email,
        token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      navigate("/login", { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!email || !token) {
    return (
      <div className="min-h-screen bg-[#EEFCF8] flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full border border-[#99F6E4] rounded-2xl p-6 text-center">
          <p className="text-sm text-[#E11D48] mb-3">
            Invalid or missing reset link.
          </p>
          <Link to="/forgot-password" className="text-sm text-[#7C3AED]">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEFCF8] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md border border-[#99F6E4] rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#134E4A] text-center mb-1">
          Reset password
        </h1>
        <p className="text-sm text-[#5B7A76] text-center mb-5">{email}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-[#E11D48] rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#134E4A] mb-1">
              New password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm"
            />
            {errors.password && (
              <p className="text-[#E11D48] text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#134E4A] mb-1">
              Confirm password
            </label>
            <input
              type="password"
              {...register("password_confirmation")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm"
            />
            {errors.password_confirmation && (
              <p className="text-[#E11D48] text-xs mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7C3AED] text-white py-2.5 rounded-lg disabled:opacity-60"
          >
            {loading ? "Saving..." : "Reset password"}
          </button>

          <Link
            to="/login"
            className="block text-center text-sm text-[#5B7A76]"
          >
            Back to login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
