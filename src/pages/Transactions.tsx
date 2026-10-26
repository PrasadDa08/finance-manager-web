import { useState, useEffect } from "react";
import { getTransactions, deleteTransaction } from "../api/transactions";
import { Link } from "react-router-dom";

interface Transaction {
  id: number;
  account?: { id: number; name: string };
  category?: { id: number; name: string; type: string };
  type: "income" | "expense";
  amount: string | number;
  note?: string | null;
  transaction_date: string;
}

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await getTransactions();
        setTransactions(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Delete this transaction?");

    if (!confirmed) return;

    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete transaction");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F3FF]">
        <p className="text-[#64748B]">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3FF] p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1E293B]">Transactions</h1>
          <Link
            to="/transactions/create"
            className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6D28D9] transition"
          >
            + Add Transaction
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-100 text-[#F43F5E] rounded-lg">
            {error}
          </div>
        )}

        {transactions.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-[#E9D5FF] text-[#64748B]">
            No transactions yet.
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white p-4 rounded-2xl border border-[#E9D5FF] flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold text-[#1E293B]">
                    {tx.category?.name || "Category"}
                  </h2>
                  <p className="text-sm text-[#64748B]">
                    {tx.account?.name || "Account"} · {tx.transaction_date}
                  </p>
                  {tx.note && (
                    <p className="text-sm text-[#64748B] mt-1">{tx.note}</p>
                  )}
                </div>

                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      tx.type === "income"
                        ? "text-emerald-600"
                        : "text-[#F43F5E]"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {tx.amount}
                  </p>
                  <div className="flex gap-3 justify-end mt-2">
                    <Link
                      to={`/transactions/${tx.id}/edit`}
                      className="text-sm text-[#7C3AED] hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="text-sm text-[#F43F5E] hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;