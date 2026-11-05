import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBudgets, deleteBudget } from "../api/budgets";
import { useToastStore } from "../store/toastStore";
import ConfirmModal from "../components/ConfirmModal";

interface BudgetItem {
  id: number;
  type: "account" | "overall";
  account_id: number;
  amount: number;
  month_start: string;
  spent: number;
  remaining: number;
  percent: number;
  status: "over" | "near" | "under";
  account: {
    id: number;
    name: string;
    type: string;
  };
}

function currentMonth() {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function Budgets() {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [month, setMonth] = useState(currentMonth());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getBudgets(month);
        const list = res.data.data || [];
        list.sort((a: any, b: any) => {
          if (a.type === "overall" && b.type !== "overall") return -1;
          if (a.type !== "overall" && b.type === "overall") return 1;
          return 0;
        });
        setBudgets(list);
      } catch (err: any) {
        setError(err.res?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [month]);

  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      setDeleting(true);
      setError(null);
      await deleteBudget(deleteId);

      setBudgets((prev) => prev.filter((b) => b.id !== deleteId));
      showToast("Budget deleted", "success");
      setDeleteId(null);
    } catch (err: any) {
      setError(err.response?.data?.message);
    } finally {
      setDeleting(false);
    }
  };
  const statusColor = (status: string) => {
    if (status === "over") return "bg-[#E11D48]";
    if (status === "near") return "bg-amber-500";
    return "bg-[#0D9488]";
  };

  const statusText = (status: string) => {
    if (status === "over") return "text-[#E11D48]";
    if (status === "near") return "text-amber-600";
    return "text-[#0F766E]";
  };

  return (
    <div className="p-4 md:p-6 bg-[#EEFCF8] min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#134E4A]">Budgets</h1>
          <p className="text-sm text-[#5B7A76]">Monthly limits</p>
        </div>
        <Link
          to="/budgets/create"
          className="bg-[#7C3AED] text-white text-sm px-3 py-2 rounded-lg hover:bg-[#6D28D9]"
        >
          + Add
        </Link>
      </div>

      <div className="mb-4">
        <label className="block text-xs text-[#5B7A76] mb-1">Month</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-[#99F6E4] bg-white rounded-lg px-3 py-2 text-sm text-[#134E4A] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
        />
      </div>

      {error && (
        <div className="mb-3 p-3 bg-rose-50 text-[#E11D48] rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[#5B7A76]">Loading budgets...</p>
      ) : budgets.length === 0 ? (
        <div className="bg-white border border-[#99F6E4] rounded-2xl p-4">
          <p className="font-semibold text-[#134E4A] mb-1">No budgets yet</p>
          <p className="text-sm text-[#5B7A76] mb-3">
            Set a monthly limit for account spendings or overall spendings.
          </p>
          <Link
            to="/budgets/create"
            className="inline-block bg-[#0D9488] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0F766E]"
          >
            Add budget
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {budgets.map((budget) => (
            <div
              key={budget.id}
              className="bg-white border border-[#99F6E4] rounded-2xl p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-semibold text-[#134E4A]">
                    {budget.type === "overall"
                      ? "Overall"
                      : budget.account?.name || "Account"}
                  </p>
                  <p
                    className={`text-xs font-medium capitalize ${statusText(budget.status)}`}
                  >
                    {budget.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#134E4A]">
                    ₹{Number(budget.spent).toFixed(0)} / ₹
                    {Number(budget.amount).toFixed(0)}
                  </p>
                  <p className="text-xs text-[#5B7A76]">
                    ₹{Number(budget.remaining).toFixed(0)} left
                  </p>
                </div>
              </div>

              <div className="h-2 bg-[#F0FDFA] rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full ${statusColor(budget.status)}`}
                  style={{ width: `${Math.min(budget.percent, 100)}%` }}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Link
                  to={`/budgets/${budget.id}/edit`}
                  className="text-sm text-[#7C3AED] hover:underline"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteId(budget.id)}
                  className="text-sm text-[#E11D48] hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={deleteId !== null}
        title="Delete budget?"
        message="Transactions will not be deleted."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

export default Budgets;
