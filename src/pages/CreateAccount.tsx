import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { createAccount } from "../api/accounts";
import { useToastStore } from "../store/toastStore";

const accountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["bank", "cash", "credit_card", "wallet"]),
  opening_balance: z.number().min(0, "Balance cannot be negative"),
  currency: z.string().min(1, "Currency is required"),
  is_active: z.boolean(),
});

type AccountFormData = z.infer<typeof accountSchema>;

const fieldHelp: Record<string, { title: string; body: string }> = {
  name: {
    title: "Account name",
    body: "A name you’ll recognize easily, e.g. HDFC Salary, Home Cash, Paytm Wallet.",
  },
  type: {
    title: "Account type",
    body: "Where this money lives: Bank, Cash, Credit Card, or Wallet.",
  },
  opening_balance: {
    title: "Opening balance",
    body: "How much money is in this account right now. You can enter 0 if it starts empty.",
  },
  currency: {
    title: "Currency",
    body: "Currency code for this account. For India, use INR.",
  },
  is_active: {
    title: "Active account",
    body: "Keep this on if you still use the account. Turn off for old/unused accounts.",
  },
};

function CreateAccount() {
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [infoKey, setInfoKey] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      currency: "INR",
      is_active: true,
      opening_balance: 0,
      type: "bank",
    },
  });

  const onSubmit = async (data: AccountFormData) => {
    try {
      setLoading(true);
      setError(null);
      await createAccount(data);
      showToast("Account created", "success");
      navigate("/accounts");
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to create account";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] bg-[#EEFCF8] flex items-center justify-center p-4 md:p-6">
      <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm w-full max-w-md border border-[#99F6E4]">
        <h1 className="text-2xl font-bold text-[#134E4A] mb-1 text-center">
          Add Account
        </h1>
        <p className="text-center text-sm text-[#5B7A76] mb-5">
          Create a bank, cash, card, or wallet account
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-[#E11D48] rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <LabelWithInfo
              label="Account Name"
              onInfo={() => setInfoKey("name")}
            />
            <input
              type="text"
              {...register("name")}
              placeholder="e.g. HDFC Salary"
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
            {errors.name && (
              <p className="text-[#E11D48] text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Type */}
          <div>
            <LabelWithInfo
              label="Account Type"
              onInfo={() => setInfoKey("type")}
            />
            <select
              {...register("type")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="bank">Bank</option>
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>

          {/* Opening balance */}
          <div>
            <LabelWithInfo
              label="Opening Balance"
              onInfo={() => setInfoKey("opening_balance")}
            />
            <input
              type="number"
              step="0.01"
              {...register("opening_balance", { valueAsNumber: true })}
              placeholder="0"
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
            {errors.opening_balance && (
              <p className="text-[#E11D48] text-xs mt-1">
                {errors.opening_balance.message}
              </p>
            )}
          </div>

          {/* Currency */}
          <div>
            <LabelWithInfo
              label="Currency"
              onInfo={() => setInfoKey("currency")}
            />
            <input
              type="text"
              {...register("currency")}
              placeholder="INR"
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
          </div>

          {/* Active */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("is_active")}
              className="w-4 h-4"
            />
            <span className="text-sm text-[#134E4A]">Active account</span>
            <button
              type="button"
              onClick={() => setInfoKey("is_active")}
              className="w-5 h-5 rounded-full border border-[#99F6E4] text-[#0D9488] text-[10px] font-bold"
            >
              i
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7C3AED] text-white py-2.5 rounded-lg hover:bg-[#6D28D9] transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/accounts")}
            className="w-full border border-[#99F6E4] text-[#5B7A76] py-2.5 rounded-lg hover:bg-[#F0FDFA] transition"
          >
            Cancel
          </button>
        </form>
      </div>

      {/* Info modal */}
      {infoKey && fieldHelp[infoKey] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-[#99F6E4] p-4">
            <h2 className="text-lg font-bold text-[#134E4A] mb-2">
              {fieldHelp[infoKey].title}
            </h2>
            <p className="text-sm text-[#5B7A76] mb-4">
              {fieldHelp[infoKey].body}
            </p>
            <button
              onClick={() => setInfoKey(null)}
              className="w-full bg-[#7C3AED] text-white text-sm py-2.5 rounded-lg hover:bg-[#6D28D9]"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LabelWithInfo({
  label,
  onInfo,
}: {
  label: string;
  onInfo: () => void;
}) {
  return (
    <label className="flex items-center gap-1.5 mb-1 text-sm font-medium text-[#134E4A]">
      {label}
      <button
        type="button"
        onClick={onInfo}
        className="w-5 h-5 rounded-full border border-[#99F6E4] text-[#0D9488] text-[10px] font-bold"
        title="Info"
      >
        i
      </button>
    </label>
  );
}

export default CreateAccount;
