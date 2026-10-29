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

const otpSchema = z.object({
  otp: z.string().length(6, "Enter the 6-digit code"),
});

type RegisterFormData = z.infer<typeof registerSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

function Register() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const requestOtp = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setError(null);
      setInfo(null);

      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/register/request-otp", data);

      setEmail(data.email);
      setStep(2);
      setInfo("We sent a 6-digit code to your email. Check inbox/spam.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (data: OtpFormData) => {
    try {
      setLoading(true);
      setError(null);

      await api.get("/sanctum/csrf-cookie");
      const res = await api.post("/api/register/verify-otp", {
        email,
        otp: data.otp,
      });

      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
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
          <h1 className="text-2xl font-bold text-[#134E4A]">
            {step === 1 ? "Create account" : "Verify email"}
          </h1>
          <p className="text-sm text-[#5B7A76] mt-1">
            {step === 1
              ? "Start tracking your money"
              : `Enter the code sent to ${email}`}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-[#E11D48] text-sm">
            {error}
          </div>
        )}

        {info && (
          <div className="mb-4 p-3 rounded-xl bg-[#F0FDFA] text-[#0F766E] text-sm">
            {info}
          </div>
        )}

        {step === 1 ? (
          <form
            onSubmit={registerForm.handleSubmit(requestOtp)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1">
                Name
              </label>
              <input
                type="text"
                {...registerForm.register("name")}
                className="w-full border border-[#99F6E4] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                placeholder="Your name"
              />
              {registerForm.formState.errors.name && (
                <p className="text-[#E11D48] text-xs mt-1">
                  {registerForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1">
                Email
              </label>
              <input
                type="email"
                {...registerForm.register("email")}
                className="w-full border border-[#99F6E4] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                placeholder="you@example.com"
              />
              {registerForm.formState.errors.email && (
                <p className="text-[#E11D48] text-xs mt-1">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1">
                Password
              </label>
              <input
                type="password"
                {...registerForm.register("password")}
                className="w-full border border-[#99F6E4] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                placeholder="Min 6 characters"
              />
              {registerForm.formState.errors.password && (
                <p className="text-[#E11D48] text-xs mt-1">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C3AED] text-white py-2.5 rounded-lg hover:bg-[#6D28D9] transition disabled:opacity-60"
            >
              {loading ? "Sending code..." : "Continue"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={otpForm.handleSubmit(verifyOtp)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1">
                6-digit code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                {...otpForm.register("otp")}
                className="w-full border border-[#99F6E4] rounded-lg px-3 py-2.5 text-sm tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                placeholder="000000"
              />
              {otpForm.formState.errors.otp && (
                <p className="text-[#E11D48] text-xs mt-1">
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C3AED] text-white py-2.5 rounded-lg hover:bg-[#6D28D9] transition disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & create account"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setError(null);
                setInfo(null);
              }}
              className="w-full border border-[#99F6E4] text-[#5B7A76] py-2.5 rounded-lg hover:bg-[#F0FDFA]"
            >
              Back
            </button>
          </form>
        )}

        <p className="text-sm text-center text-[#5B7A76] mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#7C3AED] font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
