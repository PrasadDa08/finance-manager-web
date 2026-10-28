import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTransactions, deleteTransaction } from "../api/transactions";
import { getAccounts } from "../api/accounts";
import { useToastStore } from "../store/toastStore";

interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: string | number;
  note?: string | null;
  transaction_date: string;
  account?: { id: number; name: string };
  category?: {
    id: number;
    name: string;
    type: string;
    color?: string | null;
  };
}

function formatDate(dateValue?: string) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getContrastText(bgColor?: string) {
  if (!bgColor) return "#ffffff";
  const hex = bgColor.replace("#", "");
  if (hex.length !== 6) return "#ffffff";
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 160 ? "#134E4A" : "#ffffff";
}

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accountsCount, setAccountsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const showToast = useToastStore((s) => s.show);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [txRes, accRes] = await Promise.all([
          getTransactions(),
          getAccounts(),
        ]);
        setTransactions(txRes.data.data || []);
        setAccountsCount(accRes.data.data?.length || 0);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const close = () => setOpenMenuId(null);
    if (openMenuId !== null) {
      document.addEventListener("click", close);
      return () => document.removeEventListener("click", close);
    }
  }, [openMenuId]);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Delete this transaction?");
    if (!confirmed) return;

    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showToast("Transaction deleted", "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-[#EEFCF8] min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-[#134E4A]">Transactions</h1>
          <button
            type="button"
            onClick={() => setShowInfo(true)}
            className="w-6 h-6 rounded-full border border-[#99F6E4] bg-white text-[#0D9488] text-xs font-bold"
          >
            i
          </button>
        </div>

        <Link
          to="/transactions/create"
          className="bg-[#7C3AED] text-white text-sm px-3 py-2 rounded-lg hover:bg-[#6D28D9]"
        >
          + Add
        </Link>
      </div>

      {error && (
        <div className="mb-3 p-3 bg-rose-50 text-[#E11D48] rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[#5B7A76]">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <div className="bg-white border border-[#99F6E4] rounded-2xl p-4">
          <p className="font-semibold text-[#134E4A] mb-1">
            {accountsCount === 0 ? "No accounts yet" : "No transactions yet"}
          </p>
          <p className="text-sm text-[#5B7A76] mb-3">
            {accountsCount === 0
              ? "Add an account first, then record income or expense."
              : "Add your first income or expense transaction."}
          </p>
          <Link
            to={
              accountsCount === 0 ? "/accounts/create" : "/transactions/create"
            }
            className="inline-block bg-[#0D9488] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0F766E]"
          >
            {accountsCount === 0 ? "Add account" : "Add transaction"}
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#99F6E4] rounded-2xl overflow-hidden divide-y divide-[#CCFBF1]">
          {transactions.map((tx) => {
            const bg =
              tx.category?.color ||
              (tx.type === "income" ? "#0F766E" : "#E11D48");

            return (
              <div key={tx.id} className="px-4 py-3 flex items-start gap-3">
                {/* Left badge */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border border-[#99F6E4]"
                  style={{
                    backgroundColor: bg,
                    color: getContrastText(bg),
                  }}
                >
                  {(tx.category?.name || "T").charAt(0).toUpperCase()}
                </div>

                {/* Middle content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[15px] font-semibold text-[#134E4A] truncate">
                      {tx.category?.name || "Category"}
                    </p>

                    <div className="flex items-center gap-1 shrink-0">
                      <p
                        className={`text-[15px] font-bold whitespace-nowrap ${
                          tx.type === "income"
                            ? "text-[#0F766E]"
                            : "text-[#E11D48]"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"}₹
                        {Number(tx.amount).toFixed(2)}
                      </p>

                      {/* 3 dots */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === tx.id ? null : tx.id);
                          }}
                          className="p-1.5 rounded-lg text-[#5B7A76] hover:bg-[#F0FDFA]"
                          aria-label="More options"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <circle cx="12" cy="5" r="1.7" />
                            <circle cx="12" cy="12" r="1.7" />
                            <circle cx="12" cy="19" r="1.7" />
                          </svg>
                        </button>

                        {openMenuId === tx.id && (
                          <div className="absolute right-0 top-8 z-20 w-32 bg-white border border-[#99F6E4] rounded-xl shadow-lg overflow-hidden">
                            <Link
                              to={`/transactions/${tx.id}/edit`}
                              className="block px-3 py-2.5 text-sm text-[#134E4A] hover:bg-[#F0FDFA]"
                              onClick={() => setOpenMenuId(null)}
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              className="w-full text-left px-3 py-2.5 text-sm text-[#E11D48] hover:bg-rose-50"
                              onClick={() => {
                                setOpenMenuId(null);
                                handleDelete(tx.id);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[#5B7A76] mt-0.5">
                    {tx.account?.name || "Account"} ·{" "}
                    {formatDate(tx.transaction_date)}
                  </p>

                  {tx.note && (
                    <p className="text-sm text-[#5B7A76]/70 mt-1 line-clamp-1">
                      {tx.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-[#99F6E4] p-4">
            <h2 className="text-lg font-bold text-[#134E4A] mb-2">
              What is a transaction?
            </h2>
            <p className="text-sm text-[#5B7A76] mb-4">
              A transaction is one money movement — income or expense. Example:
              paid ₹200 for food from your bank account, or received salary.
            </p>
            <button
              onClick={() => setShowInfo(false)}
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

export default Transactions;
