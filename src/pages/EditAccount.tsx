import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { getAccount, updateAccount } from "../api/accounts";

const accountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["bank", "cash", "credit_card", "wallet"]),
  opening_balance: z.number().min(0, "Balance cannot be negative"),
  currency: z.string().min(1, "Currency is required"),
  is_active: z.boolean(),
});

type AccountFormData = z.infer<typeof accountSchema>;

function EditAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
  });

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setFetching(true);
        const response = await getAccount(Number(id));
        const account = response.data.data;

        reset({
          name: account.name,
          type: account.type,
          opening_balance: account.opening_balance,
          currency: account.currency,
          is_active: account.is_active,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load Account");
      } finally {
        setFetching(false);
      }
    };

    fetchAccount();
  }, [id, reset]);

  const onSubmit = async (data: AccountFormData) => {
    try {
      setLoading(true);
      setError(null);
      await updateAccount(Number(id), data);
      navigate("/accounts");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update account");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F3FF]">
        <p className="text-[#64748B]">Loading account...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-[#E9D5FF]">
        <h1 className="text-3xl font-bold text-[#1E293B] mb-2 text-center">
          Edit Account
        </h1>
        <p className="text-center text-[#64748B] mb-6">
          Update account details
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-100 text-[#F43F5E] rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-[#1E293B]">
              Account Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full border border-[#E9D5FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
            {errors.name && (
              <p className="text-[#F43F5E] text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#1E293B]">
              Account Type
            </label>
            <select
              {...register("type")}
              className="w-full border border-[#E9D5FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="bank">Bank</option>
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="wallet">Wallet</option>
            </select>
            {errors.type && (
              <p className="text-[#F43F5E] text-sm mt-1">
                {errors.type.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#1E293B]">
              Opening Balance
            </label>
            <input
              type="number"
              step="0.01"
              {...register("opening_balance", { valueAsNumber: true })}
              className="w-full border border-[#E9D5FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
            {errors.opening_balance && (
              <p className="text-[#F43F5E] text-sm mt-1">
                {errors.opening_balance.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#1E293B]">
              Currency
            </label>
            <input
              type="text"
              {...register("currency")}
              className="w-full border border-[#E9D5FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
            {errors.currency && (
              <p className="text-[#F43F5E] text-sm mt-1">
                {errors.currency.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("is_active")}
              className="w-4 h-4"
            />
            <label className="text-[#1E293B]">Active account</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7C3AED] text-white py-2.5 rounded-lg hover:bg-[#6D28D9] transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Account"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/accounts")}
            className="w-full border border-[#E9D5FF] text-[#64748B] py-2.5 rounded-lg hover:bg-[#F5F3FF] transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditAccount;
