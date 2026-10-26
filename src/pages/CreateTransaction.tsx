import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { createTransaction } from "../api/transactions";
import { getAccounts } from "../api/accounts";
import { getCategories } from "../api/categories";
import { useNavigate } from "react-router-dom";

const transactionSchema = z.object({
  account_id: z.coerce.number().min(1, "Please select an account"),
  category_id: z.coerce.number().min(1, "Please select a category"),
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().min(0.01, "Amount must be greater than zero"),
  note: z.string().optional(),
  transaction_date: z.string().min(1, "Date is required"),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface Account {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
}

function CreateTransaction() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      transaction_date: new Date().toISOString().slice(0, 10),
      note: "",
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [accountsRes, categoriesRes] = await Promise.all([
          getAccounts(),
          getCategories(),
        ]);
        setAccounts(accountsRes.data.data);
        setCategories(categoriesRes.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message);
      }
    };

    loadData();
  }, []);

  // Reset category when type changes
  useEffect(() => {
    setValue("category_id", 0);
  }, [selectedType, setValue]);

  const filteredCategories = categories.filter(
    (cat) => cat.type === selectedType,
  );

  const onSubmit = async (data: TransactionFormData) => {
    try {
      setLoading(true);
      setError(null);

      await createTransaction(data);

      navigate("/transactions");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-[#E9D5FF]">
        <h1 className="text-3xl font-bold text-[#1E293B] mb-2 text-center">
          Add Transaction
        </h1>
        <p className="text-center text-[#64748B] mb-6">
          Record income or expense
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-100 text-[#F43F5E] rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-[#1E293B]">
              Type
            </label>
            <select
              {...register("type")}
              className="w-full border border-[#E9D5FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#1E293B]">
              Account
            </label>
            <select
              {...register("account_id")}
              className="w-full border border-[#E9D5FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value={0}>Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            {errors.account_id && (
              <p className="text-[#F43F5E] text-sm mt-1">
                {errors.account_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#1E293B]">
              Category
            </label>
            <select
              {...register("category_id")}
              className="w-full border border-[#E9D5FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value={0}>Select category</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-[#F43F5E] text-sm mt-1">
                {errors.category_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#1E293B]">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              {...register("amount")}
              className="w-full border border-[#E9D5FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-[#F43F5E] text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#1E293B]">
              Date
            </label>
            <input
              type="date"
              {...register("transaction_date")}
              className="w-full border border-[#E9D5FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
            {errors.transaction_date && (
              <p className="text-[#F43F5E] text-sm mt-1">
                {errors.transaction_date.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#1E293B]">
              Note (optional)
            </label>
            <input
              type="text"
              {...register("note")}
              className="w-full border border-[#E9D5FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              placeholder="Optional note"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7C3AED] text-white py-2.5 rounded-lg hover:bg-[#6D28D9] transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Transaction"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/transactions")}
            className="w-full border border-[#E9D5FF] text-[#64748B] py-2.5 rounded-lg hover:bg-[#F5F3FF] transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTransaction;
