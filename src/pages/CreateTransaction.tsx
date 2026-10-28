import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { createTransaction } from "../api/transactions";
import { getAccounts } from "../api/accounts";
import { getCategories } from "../api/categories";
import { useToastStore } from "../store/toastStore";

const transactionSchema = z.object({
  account_id: z.coerce.number().min(1, "Please select an account"),
  category_id: z.coerce.number().min(1, "Please select a category"),
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  note: z.string().optional(),
  transaction_date: z.string().min(1, "Date is required"),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

const fieldHelp: Record<string, { title: string; body: string }> = {
  type: {
    title: "Type",
    body: "Income = money coming in. Expense = money going out.",
  },
  account_id: {
    title: "Account",
    body: "Which account this money moved in or out of.",
  },
  category_id: {
    title: "Category",
    body: "Why this money moved, e.g. Salary, Food, Rent.",
  },
  amount: {
    title: "Amount",
    body: "How much money moved in this transaction.",
  },
  transaction_date: {
    title: "Date",
    body: "When this transaction happened.",
  },
  note: {
    title: "Note",
    body: "Optional short detail about this transaction.",
  },
};

const typeLabel: Record<string, string> = {
  bank: "Bank",
  cash: "Cash",
  credit_card: "Credit Card",
  wallet: "Wallet",
};

function CreateTransaction() {
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [infoKey, setInfoKey] = useState<string | null>(null);

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
      account_id: 0,
      category_id: 0,
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    const loadData = async () => {
      try {
        setFetching(true);
        const [accountsRes, categoriesRes] = await Promise.all([
          getAccounts(),
          getCategories(),
        ]);
        setAccounts(accountsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
      } catch (err) {
        setError("Failed to load accounts or categories");
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, []);

  // reset category when type changes
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

      await createTransaction({
        account_id: data.account_id,
        category_id: data.category_id,
        type: data.type,
        amount: data.amount,
        note: data.note || undefined,
        transaction_date: data.transaction_date,
      });

      showToast("Transaction added", "success");
      navigate("/transactions");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to create transaction";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#EEFCF8] flex items-center justify-center">
        <p className="text-sm text-[#5B7A76]">Loading...</p>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#EEFCF8] flex items-center justify-center p-4">
        <div className="bg-white border border-[#99F6E4] rounded-2xl p-5 w-full max-w-md">
          <h1 className="text-xl font-bold text-[#134E4A] mb-2">
            Add account first
          </h1>
          <p className="text-sm text-[#5B7A76] mb-4">
            You need at least one account before adding a transaction.
          </p>
          <Link
            to="/accounts/create"
            className="inline-block bg-[#7C3AED] text-white text-sm px-4 py-2.5 rounded-lg"
          >
            Add account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#EEFCF8] flex items-center justify-center p-4 md:p-6">
      <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm w-full max-w-md border border-[#99F6E4]">
        <h1 className="text-2xl font-bold text-[#134E4A] mb-1 text-center">
          Add Transaction
        </h1>
        <p className="text-center text-sm text-[#5B7A76] mb-5">
          Record income or expense
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-[#E11D48] rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <LabelWithInfo label="Type" onInfo={() => setInfoKey("type")} />
            <select
              {...register("type")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <LabelWithInfo
              label="Account"
              onInfo={() => setInfoKey("account_id")}
            />
            <select
              {...register("account_id")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value={0}>Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} ({typeLabel[account.type] || account.type})
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
            <LabelWithInfo
              label="Category"
              onInfo={() => setInfoKey("category_id")}
            />
            <select
              {...register("category_id")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value={0}>Select category</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-[#E11D48] text-xs mt-1">
                {errors.category_id.message}
              </p>
            )}
            {filteredCategories.length === 0 && (
              <p className="text-xs text-[#5B7A76] mt-1">
                No {selectedType} categories.{" "}
                <Link
                  to="/categories/create"
                  className="text-[#7C3AED] hover:underline"
                >
                  Add one
                </Link>
              </p>
            )}
          </div>

          <div>
            <LabelWithInfo label="Amount" onInfo={() => setInfoKey("amount")} />
            <input
              type="number"
              step="0.01"
              {...register("amount")}
              placeholder="0.00"
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
            {errors.amount && (
              <p className="text-[#E11D48] text-xs mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <LabelWithInfo
              label="Date"
              onInfo={() => setInfoKey("transaction_date")}
            />
            <input
              type="date"
              {...register("transaction_date")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
          </div>

          <div>
            <LabelWithInfo
              label="Note (optional)"
              onInfo={() => setInfoKey("note")}
            />
            <input
              type="text"
              {...register("note")}
              placeholder="Optional note"
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
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
            className="w-full border border-[#99F6E4] text-[#5B7A76] py-2.5 rounded-lg hover:bg-[#F0FDFA] transition"
          >
            Cancel
          </button>
        </form>
      </div>

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
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-sm font-medium text-[#134E4A]">{label}</span>
      <button
        type="button"
        onClick={onInfo}
        className="w-5 h-5 rounded-full border border-[#99F6E4] text-[#0D9488] text-[10px] font-bold"
      >
        i
      </button>
    </div>
  );
}

export default CreateTransaction;
