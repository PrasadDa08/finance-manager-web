import { useEffect, useState } from "react";
import { getAccounts, deleteAccount } from "../api/accounts";
import { Link } from "react-router-dom";
import { useToastStore } from "../store/toastStore";

interface Account {
  id: number;
  name: string;
  type: string;
  opening_balance: number;
  currency: string;
  is_active: boolean;
}

function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await getAccounts();
        setAccounts(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load Accouns");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this account?",
    );

    if (!confirmed) return;

    try {
      await deleteAccount(id);
      setAccounts((prev) => prev.filter((account) => account.id !== id));
      showToast("Account deleted", "success");
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Failed to delete account",
        "error",
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F3FF]">
        <p className="text-[#64748B]">Loading accounts...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-[#EEFCF8] min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-[#134E4A]">Accounts</h1>
          <button
            type="button"
            onClick={() => setShowInfo(true)}
            className="w-6 h-6 rounded-full border border-[#99F6E4] bg-white text-[#0D9488] text-xs font-bold"
            title="What is an account?"
          >
            i
          </button>
        </div>

        <Link
          to="/accounts/create"
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
        <p className="text-sm text-[#5B7A76]">Loading accounts...</p>
      ) : accounts.length === 0 ? (
        <div className="bg-white border border-[#99F6E4] rounded-2xl p-4">
          <p className="font-semibold text-[#134E4A] mb-1">No accounts yet</p>
          <p className="text-sm text-[#5B7A76] mb-3">
            Add your first account to start tracking income and expenses.
          </p>
          <Link
            to="/accounts/create"
            className="inline-block bg-[#0D9488] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0F766E]"
          >
            Add account
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#99F6E4] rounded-2xl overflow-hidden divide-y divide-[#CCFBF1]">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={`px-3 py-3 flex items-start justify-between gap-3 ${
                account.is_active ? "bg-white" : "bg-[#FFE4E6]"
              }`}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#134E4A] truncate">
                  {account.name}
                </p>
                <p className="text-xs text-[#5B7A76] capitalize">
                  {account.type.replace("_", " ")} ·{" "}
                  {account.is_active ? "Active" : "Inactive"}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-[#134E4A]">
                  ₹{Number(account.opening_balance).toFixed(2)}
                </p>
                <div className="flex items-center justify-end gap-3 mt-1">
                  <Link
                    to={`/accounts/${account.id}/edit`}
                    className="text-xs text-[#7C3AED] hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="text-xs text-[#E11D48] hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-[#99F6E4] p-4">
            <h2 className="text-lg font-bold text-[#134E4A] mb-2">
              What is an account?
            </h2>
            <p className="text-sm text-[#5B7A76] mb-3">
              An account is where your money is kept — bank, cash, UPI wallet,
              or credit card. Add accounts first so you can record income and
              expenses against them.
            </p>
            <p className="text-sm text-[#5B7A76] mb-4">
              Examples: HDFC Bank, Cash, Paytm Wallet
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

export default Accounts;
