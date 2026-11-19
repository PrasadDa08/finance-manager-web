import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPassword } from "../api/auth";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

type FormData = z.infer<typeof schema>;

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);
      await forgotPassword(data.email);
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEFCF8] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md border border-[#99F6E4] rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#134E4A] text-center mb-1">
          Forgot password
        </h1>
        <p className="text-sm text-[#5B7A76] text-center mb-5">
          We’ll email you a reset link
        </p>

        {sent ? (
          <div className="space-y-4">
            <div className="p-3 bg-[#F0FDFA] border border-[#99F6E4] rounded-xl text-sm text-[#134E4A]">
              If that email exists in our system, a reset link has been sent.
              Check your inbox and spam folder.
            </div>
            <Link
              to="/login"
              className="block text-center text-sm text-[#7C3AED] font-medium"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 text-[#E11D48] rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-[#E11D48] text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C3AED] text-white py-2.5 rounded-lg disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>

            <Link
              to="/login"
              className="block text-center text-sm text-[#5B7A76]"
            >
              Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
