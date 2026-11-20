import { useEffect, useState } from "react";
import { getReport } from "../api/reports";
import { getAccounts } from "../api/accounts";
import { exportTransactions } from "../api/export";
import { downloadBlob } from "../utils/download";
import { useToastStore } from "../store/toastStore";

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function Reports() {
  const [month, setMonth] = useState(currentMonth());
  const [accountId, setAccountId] = useState<string | number>("all");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const res = await getAccounts();
        setAccounts(res.data.data || []);
      } catch {
        // ignore
      }
    };
    loadAccounts();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getReport({
          month,
          account_id: accountId,
        });
        setReport(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load report");
        setReport(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [month, accountId]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const res = await exportTransactions({
        month,
        account_id: accountId || "all",
      });

      const filename = `transactions-${month}.csv`;
      downloadBlob(res.data, filename);
      showToast("Export downloaded", "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Export failed", "error");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-[#EEFCF8] min-h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#134E4A]">Reports</h1>
        <p className="text-sm text-[#5B7A76]">
          Where your money went this month
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs text-[#5B7A76] mb-1">Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full border border-[#99F6E4] bg-white rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-[#5B7A76] mb-1">Account</label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full border border-[#99F6E4] bg-white rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="border border-[#99F6E4] bg-white text-[#134E4A] text-sm px-3 py-2 rounded-lg disabled:opacity-60"
        >
          {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      {error && (
        <div className="mb-3 p-3 bg-rose-50 text-[#E11D48] rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[#5B7A76]">Loading report...</p>
      ) : !report ? (
        <p className="text-sm text-[#5B7A76]">No data</p>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="bg-white border border-[#99F6E4] rounded-2xl p-3 shadow-sm">
              <p className="text-[11px] text-[#5B7A76]">Income</p>
              <p className="text-base md:text-lg font-bold text-[#0F766E]">
                ₹{Number(report.total_income).toFixed(0)}
              </p>
            </div>
            <div className="bg-white border border-[#99F6E4] rounded-2xl p-3 shadow-sm">
              <p className="text-[11px] text-[#5B7A76]">Expense</p>
              <p className="text-base md:text-lg font-bold text-[#E11D48]">
                ₹{Number(report.total_expense).toFixed(0)}
              </p>
            </div>
            <div className="bg-white border border-[#99F6E4] rounded-2xl p-3 shadow-sm">
              <p className="text-[11px] text-[#5B7A76]">Net</p>
              <p
                className={`text-base md:text-lg font-bold ${
                  Number(report.net) >= 0 ? "text-[#0F766E]" : "text-[#E11D48]"
                }`}
              >
                ₹{Number(report.net).toFixed(0)}
              </p>
            </div>
          </div>

          {/* Expense by category */}
          <Section title="Expenses by category">
            {(report.expense_by_category || []).length === 0 ? (
              <Empty text="No expenses this month" />
            ) : (
              <div className="space-y-3">
                {report.expense_by_category.map((item: any) => (
                  <CategoryRow key={item.category_id} item={item} />
                ))}
              </div>
            )}
          </Section>

          {/* Income by category */}
          <Section title="Income by category">
            {(report.income_by_category || []).length === 0 ? (
              <Empty text="No income this month" />
            ) : (
              <div className="space-y-3">
                {report.income_by_category.map((item: any) => (
                  <CategoryRow key={item.category_id} item={item} />
                ))}
              </div>
            )}
          </Section>

          {/* Accounts summary */}
          {accountId === "all" && (
            <Section title="By account">
              {(report.accounts_summary || []).length === 0 ? (
                <Empty text="No account activity this month" />
              ) : (
                <div className="space-y-2">
                  {report.accounts_summary.map((a: any) => (
                    <div
                      key={a.account_id}
                      className="bg-white border border-[#99F6E4] rounded-2xl p-3"
                    >
                      <p className="font-semibold text-[#134E4A] mb-1">
                        {a.name}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <span className="text-[#0F766E]">
                          Income ₹{Number(a.income).toFixed(0)}
                        </span>
                        <span className="text-[#E11D48]">
                          Expense ₹{Number(a.expense).toFixed(0)}
                        </span>
                        <span
                          className={
                            Number(a.net) >= 0
                              ? "text-[#0F766E] font-semibold"
                              : "text-[#E11D48] font-semibold"
                          }
                        >
                          Net ₹{Number(a.net).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          )}
        </>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-sm font-bold text-[#134E4A] mb-2">{title}</h2>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="bg-white border border-[#99F6E4] rounded-2xl p-4 text-sm text-[#5B7A76]">
      {text}
    </div>
  );
}

function CategoryRow({ item }: { item: any }) {
  return (
    <div className="bg-white border border-[#99F6E4] rounded-2xl p-3">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: item.color || "#6B7280" }}
          />
          <span className="text-sm font-medium text-[#134E4A] truncate">
            {item.name}
          </span>
        </div>
        <div className="text-right shrink-0">
          <span className="text-sm font-bold text-[#134E4A]">
            ₹{Number(item.amount).toFixed(0)}
          </span>
          <span className="text-xs text-[#5B7A76] ml-1">
            {Number(item.percent).toFixed(0)}%
          </span>
        </div>
      </div>
      <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.min(Number(item.percent) || 0, 100)}%`,
            backgroundColor: item.color || "#0D9488",
          }}
        />
      </div>
    </div>
  );
}

export default Reports;
