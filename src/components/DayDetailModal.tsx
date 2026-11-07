import { useEffect, useState } from "react";
import { getDailySummary } from "../api/dailySpend";
function DayDetailModal({
  open,
  onClose,
  day,
}: {
  open: boolean;
  onClose: () => void;

  day: {
    date: string;
    day: string;
    daily_limit: number;
    spent: number;
    remaining: number;
    status: string;
    kind: string;
  } | null;
}) {
  const [txns, setTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!open || !day) return;
    const load = async () => {
      try {
        setLoading(true);
        console.log("Hello");
        // your API: get transactions for day.date
        const res = await getDailySummary(day.date);
        setTxns(res.data.data || []);
      } catch (err: any) {
        setTxns([]);
        console.log("err: ", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, day]);
  if (!open || !day) return null;

  const quote =
    day.kind === "upcoming"
      ? "Day not started yet. A small plan goes a long way."
      : day.status === "over"
        ? "You spent more than the limit — no need to worry. You can control spending on other days."
        : "Nice control today. Small wins add up.";

  const statusLabel =
    day.kind === "upcoming"
      ? "Upcoming"
      : day.status === "over"
        ? "Over spent"
        : "Under spent";

  const statusColor =
    day.kind === "upcoming"
      ? "text-[#64748B]"
      : day.status === "over"
        ? "text-[#E11D48]"
        : "text-[#0F766E]";

  const title = `${day.day.slice(0, 3)}, ${day.date.slice(-2)} ${monthName(day.date)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white border border-[#99F6E4] rounded-2xl p-4 shadow-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-[#134E4A]">{title}</h2>
            {day.kind === "today" && (
              <span className="text-xs font-semibold text-[#7C3AED]">
                Today
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#5B7A76] text-xl leading-none px-1"
          >
            ×
          </button>
        </div>

        {/* Summary chips */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="rounded-xl bg-[#F0FDFA] border border-[#99F6E4] p-2 text-center">
            <p className="text-[10px] text-[#5B7A76]">Limit</p>
            <p className="text-sm font-bold text-[#134E4A]">
              {Number(day.daily_limit).toFixed(0)} Rs.
            </p>
          </div>
          <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2 text-center">
            <p className="text-[10px] text-[#5B7A76]">Spent</p>
            <p className="text-sm font-bold text-[#134E4A]">
              {Number(day.spent).toFixed(0)} Rs.
            </p>
          </div>
          <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2 text-center">
            <p className="text-[10px] text-[#5B7A76]">Left</p>
            <p className="text-sm font-bold text-[#134E4A]">
              {Number(day.remaining).toFixed(0)} Rs.
            </p>
          </div>
        </div>

        <p className={`text-sm font-semibold mb-2 ${statusColor}`}>
          {statusLabel}
        </p>

        <p className="text-sm text-[#5B7A76] bg-[#F0FDFA] border border-[#99F6E4] rounded-xl p-3 mb-4">
          {quote}
        </p>

        <h3 className="text-sm font-bold text-[#134E4A] mb-2">Transactions</h3>

        {loading ? (
          <p className="text-sm text-[#5B7A76]">Loading...</p>
        ) : txns.length === 0 ? (
          <p className="text-sm text-[#5B7A76]">No transactions this day</p>
        ) : (
          <div className="space-y-2">
            {txns.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-[#CCFBF1] bg-[#F0FDFA] px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-[#134E4A]">
                    {t.category?.name || "Category"}
                  </p>
                  <p className="text-xs text-[#5B7A76]">
                    {t.account?.name || "Account"}
                    {t.note ? ` · ${t.note}` : ""}
                  </p>
                </div>
                <p
                  className={`text-sm font-bold ${
                    t.type === "expense" ? "text-[#E11D48]" : "text-[#0F766E]"
                  }`}
                >
                  {t.type === "expense" ? "-" : "+"}₹
                  {Number(t.amount).toFixed(0)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DayDetailModal;

function monthName(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", { month: "short" });
}
