import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod";
import { getBudget, updateBudget } from "../api/budgets";
import { useToastStore } from "../store/toastStore";
import { getAccounts } from "../api/accounts";

const budgetSchema = z
  .object({
    type: z.enum(["overall", "account"]),
    account_id: z.coerce.number().nullable(),
    amount: z.coerce.number().min(0.01, "Amount must me greater than 0"),
    month_start: z.string().min(1, "select a month"),
  })
  .superRefine((data, ctx) => {
    if (data.type === "account" && (!data.account_id || data.account_id < 1)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select an account",
        path: ["account_id"],
      });
    }
  });

type BudgetFormData = z.infer<typeof budgetSchema>;

function currentMonthStart() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");

  return `${y}-${m}-01`;
}

const typeLabel: Record<string, string> = {
  bank: "Bank",
  cash: "Cash",
  credit_card: "Credit Card",
  wallet: "Wallet",
};

function EditBudget() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);
  const [accounts, setAccounts] = useState<any[]>([]);
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      account_id: 0,
      amount: 0,
      month_start: currentMonthStart(),
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    const load = async () => {
      try {
        setFetching(true);
        setError(null);
        const [budgetRes, accRes] = await Promise.all([
          getBudget(Number(id)),
          getAccounts(),
        ]);
        const budget = budgetRes.data.data;
        setAccounts(accRes.data.data || []);

        reset({
          type: budget.type,
          account_id: budget.account_id || 0,
          amount: budget.amount,
          month_start: budget.month_start.slice(0, 7),
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load budget");
      } finally {
        setFetching(false);
      }
    };

    load();
  }, [id, reset]);

  const onSubmit = async (data: BudgetFormData) => {
    try {
      setLoading(true);
      setError(null);
      await updateBudget(Number(id), data);
      showToast("Budget updated", "success");
      navigate("/budgets");
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to update budget";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#EEFCF8] flex items-center justify-center">
        <p className="text-sm text-[#5B7A76]">Loading Budget...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#EEFCF8] flex items-center justify-center p-4 md:p-6">
      <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm w-full max-w-md border border-[#99F6E4]">
        <h1 className="text-2xl font-bold text-[#134E4A] mb-1 text-center">
          Edit Budget
        </h1>
        <p className="text-center text-sm text-[#5B7A76] mb-5">
          Set a monthly limit for an expense category
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-[#E11D48] rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#134E4A] mb-1">
              Type
            </label>
            <select
              {...register("type")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value={0}>Select Type</option>
              <option value="overall">Overall</option>
              <option value="account">Account</option>
            </select>
          </div>

          {selectedType === "account" && (
            <div>
              <label className="block text-sm font-medium text-[#134E4A] mb-1">
                Account
              </label>
              <select
                {...register("account_id")}
                className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              >
                <option value={0}>Select account</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({typeLabel[a.type] || a.type})
                  </option>
                ))}
              </select>
              {errors.account_id && (
                <p className="text-[#E11D48] text-xs mt-1">
                  {errors.account_id.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#134E4A] mb-1">
              Monthly limit
            </label>
            <input
              type="number"
              step="0.01"
              {...register("amount")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              placeholder="e.g. 8000"
            />
            {errors.amount && (
              <p className="text-[#E11D48] text-xs mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#134E4A] mb-1">
              Month
            </label>
            <input
              type="month"
              {...register("month_start")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
            <p className="text-xs text-[#5B7A76] mt-1">
              We use the month only.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7C3AED] text-white py-2.5 rounded-lg hover:bg-[#6D28D9] disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save budget"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/budgets")}
            className="w-full border border-[#99F6E4] text-[#5B7A76] py-2.5 rounded-lg hover:bg-[#F0FDFA]"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditBudget;
