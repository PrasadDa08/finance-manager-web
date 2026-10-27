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
  const [showFilters, setShowFilters] = useState(false);
  const filtersActive =
    accountId !== "" || period !== "all" || !!fromDate || !!toDate;

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

  const hasAccounts = accounts.length > 0;
  const hasRecent = recent.length > 0;

  return (
    <div className="p-4 md:p-6 bg-[#EEFCF8] min-h-[calc(100vh-7rem)]">
      {/* Header */}
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#134E4A]">
            Hi, {user?.name || "User"}
          </h1>
          <p className="text-sm text-[#5B7A76]">Your finance overview</p>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="relative p-2 rounded-lg bg-white border border-[#99F6E4] text-[#134E4A] shrink-0"
          title="Filters"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          {filtersActive && (
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#7C3AED]" />
          )}
        </button>
      </div>

      {/* Collapsible panel */}
      {showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 p-3 bg-white border border-[#99F6E4] rounded-xl">
          {/* Account, Period, From, To fields go here (same as before with labels) */}

          {/* Filters */}
          {/* Account */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#5B7A76]">Account</label>
            <select
              value={accountId}
              onChange={(e) =>
                setAccountId(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              className="w-full border border-[#99F6E4] bg-white rounded-lg px-2.5 py-2 text-sm text-[#134E4A] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="">All accounts</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Period */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#5B7A76]">Period</label>
            <select
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value as any);
                setFromDate("");
                setToDate("");
              }}
              className="w-full border border-[#99F6E4] bg-white rounded-lg px-2.5 py-2 text-sm text-[#134E4A] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="all">All time</option>
              <option value="this_week">This week</option>
              <option value="this_month">This month</option>
              <option value="this_year">This year</option>
            </select>
          </div>

          {/* From date */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#5B7A76]">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                const value = e.target.value;
                setFromDate(value);
                if (toDate && value && toDate < value) setToDate("");
              }}
              className="w-full border border-[#99F6E4] bg-white rounded-lg px-2.5 py-2 text-sm text-[#134E4A] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
          </div>

          {/* To date */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-[#5B7A76]">To</label>
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-[#99F6E4] bg-white rounded-lg px-2.5 py-2 text-sm text-[#134E4A] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
          </div>
        </div>
      )}
      {loading ? (
        <p className="text-sm text-[#5B7A76]">Loading dashboard...</p>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
            <SummaryCard
              label="Balance"
              value={summary.total_balance}
              accent="purple"
            />
            <SummaryCard
              label="Income"
              value={summary.total_income}
              accent="teal"
            />
            <SummaryCard
              label="Expense"
              value={summary.total_expense}
              accent="rose"
            />
          </div>

          {/* No accounts CTA */}
          {!hasAccounts && (
            <div className="bg-white border border-[#99F6E4] rounded-2xl p-4 mb-4">
              <p className="font-semibold text-[#134E4A] mb-1">
                Create your first account
              </p>
              <p className="text-sm text-[#5B7A76] mb-3">
                Add a bank, cash, or wallet account to start tracking.
              </p>
              <Link
                to="/accounts/create"
                className="inline-block bg-[#7C3AED] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#6D28D9]"
              >
                Add account
              </Link>
            </div>
          )}

          {/* Recent transactions */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-[#134E4A]">Recent</h2>
            {hasRecent && (
              <Link
                to="/transactions"
                className="text-sm text-[#7C3AED] hover:underline"
              >
                View all
              </Link>
            )}
          </div>

          <div className="bg-white border border-[#99F6E4] rounded-2xl overflow-hidden">
            {!hasRecent ? (
              <div className="p-4">
                <p className="font-semibold text-[#134E4A] mb-1">
                  {hasAccounts ? "No transactions yet" : "No activity yet"}
                </p>
                <p className="text-sm text-[#5B7A76] mb-3">
                  {hasAccounts
                    ? "Add your first income or expense to see it here."
                    : "First add an account, then record a transaction."}
                </p>
                <Link
                  to={hasAccounts ? "/transactions/create" : "/accounts/create"}
                  className="inline-block bg-[#0D9488] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0F766E]"
                >
                  {hasAccounts ? "Add transaction" : "Add account"}
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#CCFBF1]">
                {recent.map((tx) => (
                  <div
                    key={tx.id}
                    className="px-3 py-3 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#134E4A] truncate">
                        {tx.category?.name || "Category"}
                      </p>
                      <p className="text-xs text-[#5B7A76] truncate">
                        {tx.account?.name || "Account"} ·{" "}
                        {formatDate(tx.transaction_date)}
                      </p>
                    </div>
                    <p
                      className={`text-sm font-semibold whitespace-nowrap ${
                        tx.type === "income"
                          ? "text-[#0F766E]"
                          : "text-[#E11D48]"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}₹
                      {Number(tx.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
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

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "purple" | "teal" | "rose";
}) {
  const bar =
    accent === "purple"
      ? "bg-[#7C3AED]"
      : accent === "teal"
        ? "bg-[#0D9488]"
        : "bg-[#E11D48]";

  const amountColor =
    accent === "purple"
      ? "text-[#134E4A]"
      : accent === "teal"
        ? "text-[#0F766E]"
        : "text-[#E11D48]";

  return (
    <div className="bg-white border border-[#99F6E4] rounded-xl p-3 relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${bar}`} />
      <p className="text-[11px] md:text-xs text-[#5B7A76] mb-1 pl-2">{label}</p>
      <p className={`text-sm md:text-lg font-bold pl-2 ${amountColor}`}>
        ₹{Number(value || 0).toFixed(2)}
      </p>
    </div>
  );
}

export default Dashboard;
