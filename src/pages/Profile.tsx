import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProfile, updateProfile, updatePassword } from "../api/profile";
import { useToastStore } from "../store/toastStore";
import { useAuthStore } from "../store/authStore"; // adjust if your store name differs

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    password: z.string().min(6, "New password must be at least 6 characters"),
    password_confirmation: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

function Profile() {
  const showToast = useToastStore((s) => s.show);
  const user = useAuthStore((s) => s.user);

  const setUser = useAuthStore((s) => s.setUser); // if you store user in zustand
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", phone: "" },
  });

  const {
    register: registerPass,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    formState: { errors: passErrors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getProfile();
        const data = res.data.data;
        setEmail(data.email || "");
        reset({
          name: data.name || "",
          phone: data.phone || "",
        });
      } catch (err: any) {
        showToast(
          err.response?.data?.message || "Failed to load profile",
          "error",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reset, showToast]);

  const onSaveProfile = async (data: ProfileForm) => {
    try {
      setSaving(true);
      const res = await updateProfile({
        name: data.name,
        phone: data.phone || null,
      });
      const updated = res.data.data;
      // in onSaveProfile:
      if (user) {
        setUser({ ...user, name: updated.name });
      }
      showToast("Profile updated", "success");
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Failed to update profile",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const onSavePassword = async (data: PasswordForm) => {
    try {
      setSavingPass(true);
      await updatePassword(data);
      resetPass();
      showToast("Password updated", "success");
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Failed to update password",
        "error",
      );
    } finally {
      setSavingPass(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#EEFCF8] flex items-center justify-center">
        <p className="text-sm text-[#5B7A76]">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-[#EEFCF8] min-h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#134E4A]">My Profile</h1>
        <p className="text-sm text-[#5B7A76]">
          Update your details and password
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Profile form */}
        <div className="bg-white border border-[#99F6E4] rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-[#134E4A] mb-4">Account</h2>
          <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full border border-[#E2E8F0] bg-[#F8FAFC] rounded-lg px-3 py-2 text-sm text-[#5B7A76]"
              />
              <p className="text-[11px] text-[#5B7A76] mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1">
                Name
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm"
              />
              {errors.name && (
                <p className="text-[#E11D48] text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1">
                Phone (optional)
              </label>
              <input
                type="text"
                {...register("phone")}
                placeholder="For future WhatsApp linking"
                className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#7C3AED] text-white py-2.5 rounded-lg disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </form>
        </div>

        {/* Password form */}
        <div className="bg-white border border-[#99F6E4] rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-[#134E4A] mb-4">
            Change password
          </h2>
          <form
            onSubmit={handlePassSubmit(onSavePassword)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1">
                Current password
              </label>
              <input
                type="password"
                {...registerPass("current_password")}
                className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm"
              />
              {passErrors.current_password && (
                <p className="text-[#E11D48] text-xs mt-1">
                  {passErrors.current_password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1">
                New password
              </label>
              <input
                type="password"
                {...registerPass("password")}
                className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm"
              />
              {passErrors.password && (
                <p className="text-[#E11D48] text-xs mt-1">
                  {passErrors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1">
                Confirm new password
              </label>
              <input
                type="password"
                {...registerPass("password_confirmation")}
                className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm"
              />
              {passErrors.password_confirmation && (
                <p className="text-[#E11D48] text-xs mt-1">
                  {passErrors.password_confirmation.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={savingPass}
              className="w-full bg-[#0D9488] text-white py-2.5 rounded-lg disabled:opacity-60"
            >
              {savingPass ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
