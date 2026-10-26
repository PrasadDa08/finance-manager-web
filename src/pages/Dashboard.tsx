import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";
import { getDashboard } from "../api/dashboard";
import { getAccounts } from "../api/accounts";

function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<
    "all" | "this_week" | "this_month" | "this_year"
  >("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [accountId, setAccountId] = useState<number | "">("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    total_balance: 0,
    total_income: 0,
    total_expense: 0,
    net: 0,
  });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const res = await getAccounts();
        setAccounts(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    loadAccounts();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getDashboard({
          period: fromDate || toDate ? undefined : period,
          account_id: accountId === "" ? undefined : Number(accountId),
          from_date: fromDate || undefined,
          to_date: toDate || undefined,
        });

        setSummary(res.data.data.summary);
        setRecent(res.data.data.recent_transactions);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [period, accountId, fromDate, toDate]);

  if (loading) {
    return <div className="p-6 text-[#64748B]">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">
            Welcome, {user?.name || "User"}
          </h1>
          <p className="text-[#64748B]">Your finance overview</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={accountId}
            onChange={(e) =>
              setAccountId(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border border-[#E9D5FF] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          >
            <option value="">All accounts</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="border border-[#E9D5FF] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          >
            <option value="all">All time</option>
            <option value="this_week">This week</option>
            <option value="this_month">This month</option>
            <option value="this_year">This year</option>
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              const value = e.target.value;
              setFromDate(value);

              // if toDate is before new fromDate, clear toDate
              if (toDate && value && toDate < value) {
                setToDate("");
              }
            }}
            className="border border-[#E9D5FF] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />

          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-[#E9D5FF] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-[#E9D5FF]">
          <p className="text-sm text-[#64748B] mb-1">Total Balance</p>
          <p className="text-2xl font-bold text-[#1E293B]">
            ₹ {Number(summary.total_balance).toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E9D5FF]">
          <p className="text-sm text-[#64748B] mb-1">Total Income</p>
          <p className="text-2xl font-bold text-emerald-600">
            ₹ {Number(summary.total_income).toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E9D5FF]">
          <p className="text-sm text-[#64748B] mb-1">Total Expense</p>
          <p className="text-2xl font-bold text-[#F43F5E]">
            ₹ {Number(summary.total_expense).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#1E293B]">
          Recent Transactions
        </h2>
        <Link
          to="/transactions"
          className="text-sm text-[#7C3AED] hover:underline"
        >
          View all
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl border border-[#E9D5FF] text-[#64748B]">
          No transactions for this period.
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map((tx) => (
            <div
              key={tx.id}
              className="bg-white p-4 rounded-2xl border border-[#E9D5FF] flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-[#1E293B]">
                  {tx.category?.name || "Category"}
                </p>
                <p className="text-sm text-[#64748B]">
                  {tx.account?.name || "Account"} · {tx.transaction_date}
                </p>
              </div>
              <p
                className={`font-semibold ${
                  tx.type === "income" ? "text-emerald-600" : "text-[#F43F5E]"
                }`}
              >
                {tx.type === "income" ? "+" : "-"}
                {tx.amount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
