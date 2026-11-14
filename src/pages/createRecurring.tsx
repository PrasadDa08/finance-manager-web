import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { createRecurring } from "../api/recurring";
import { getAccounts } from "../api/accounts";
import { getCategories } from "../api/categories";
import { useToastStore } from "../store/toastStore";

const reccuringSchema = z.object({
  account_id: z.coerce.number().min(1, "Select account"),
  category_id: z.coerce.number().min(1, "Select category"),
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  note: z.string().optional(),
  day_of_month: z.coerce.number().min(1).max(28),
  start_month: z.string().min(1, "Select start month"),
  end_month: z.string().optional(),
});

type recurringFormData = z.infer<typeof reccuringSchema>;

function currentMonth() {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const typeLabel: Record<string, string> = {
  bank: "Bank",
  cash: "Cash",
  credit_card: "Credit Card",
  wallet: "Wallet",
};

function CreateRecurring() {
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<recurringFormData>({
    resolver: zodResolver(reccuringSchema),
    defaultValues: {
      type: "expense",
      account_id: 0,
      category_id: 0,
      amount: 0,
      note: "",
      day_of_month: 1,
      start_month: currentMonth(),
      end_month: "",
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    const load = async () => {
      try {
        const [accRes, catRes] = await Promise.all([
          getAccounts(),
          getCategories(),
        ]);

        setAccounts(accRes.data.data || []);
        setCategories(catRes.data.data || []);
      } catch (err: any) {
        setError("Failed to load accounts or categories");
      }
    };

    load();
  }, []);

  useEffect(() => {
    setValue("category_id", 0);
  }, [selectedType, setValue]);

  const filteredCategories = categories.filter((c) => c.type === selectedType);

  const onSubmit = async (data: recurringFormData) => {
    try {
      setLoading(true);
      setError(null);
      await createRecurring({
        account_id: data.account_id,
        category_id: data.category_id,
        type: data.type,
        amount: data.amount,
        note: data.note || null,
        day_of_month: data.day_of_month,
        start_month: `${data.start_month}-01`,
        end_month: data.end_month ? `${data.end_month}-01` : null,
        is_active: true,
      });

      showToast("Template created", "success");
      navigate("/recurrings");
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to create";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#EEFCF8] flex items-center justify-center p-4 md:p-6">
      <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm w-full max-w-md border border-[#99F6E4]">
        <h1 className="text-2xl font-bold text-[#134E4A] mb-1 text-center">
          Add recurring
        </h1>
        <p className="text-center text-sm text-[#5B7A76] mb-5">
          Rent, salary, SIP — confirm each month when due
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
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#134E4A] mb-1">
              Account
            </label>
            <select
              {...register("account_id")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm"
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

          <div>
            <label className="block text-sm font-medium text-[#134E4A] mb-1">
              Category
            </label>
            <select
              {...register("category_id")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm"
            >
              <option value={0}>Select category</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-[#E11D48] text-xs mt-1">
                {errors.category_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#134E4A] mb-1">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              {...register("amount")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm"
            />
            {errors.amount && (
              <p className="text-[#E11D48] text-xs mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#134E4A] mb-1">
              Day of month (1–28)
            </label>
            <input
              type="number"
              min={1}
              max={28}
              {...register("day_of_month")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#134E4A] mb-1">
              Starts from
            </label>
            <input
              type="month"
              {...register("start_month")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#134E4A] mb-1">
              Ends (optional)
            </label>
            <input
              type="month"
              {...register("end_month")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#134E4A] mb-1">
              Note (optional)
            </label>
            <input
              type="text"
              {...register("note")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7C3AED] text-white py-2.5 rounded-lg disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save template"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/recurrings")}
            className="w-full border border-[#99F6E4] text-[#5B7A76] py-2.5 rounded-lg"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRecurring;
