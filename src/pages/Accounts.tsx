import { useEffect, useState } from "react";
import { getAccounts, deleteAccount } from "../api/accounts";
import { Link } from "react-router-dom";

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
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete account");
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
    <div className="min-h-screen bg-[#F5F3FF] p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1E293B]">Accounts</h1>
          <Link
            to="/accounts/create"
            className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6D28D9] transition"
          >
            + Add Account
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-100 text-[#F43F5E] rounded-lg">
            {error}
          </div>
        )}

        {accounts.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-[#E9D5FF] text-[#64748B]">
            No accounts yet. Create your first account.
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="bg-white p-4 rounded-2xl border border-[#E9D5FF] flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold text-[#1E293B]">
                    {account.name}
                  </h2>
                  <p className="text-sm text-[#64748B] capitalize">
                    {account.type.replace("_", " ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#1E293B]">
                    {account.currency} {account.opening_balance}
                  </p>
                  <p className="text-sm text-[#64748B]">
                    {account.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to={`/accounts/${account.id}/edit`}
                    className="text-sm text-[#7C3AED] hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(account.id)}
                    className="text-sm text-[#F43F5E] hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Accounts;
