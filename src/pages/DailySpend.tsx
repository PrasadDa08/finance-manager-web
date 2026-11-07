import { useState, useEffect } from "react";
import { getDailySpend } from "../api/dailySpend";
import { getCategories } from "../api/categories";
import DayDetailModal from "../components/DayDetailModal";

interface DayItem {
  date: string;
  day: string;
  daily_limit: number;
  spent: number;
  remaining: number;
  kind: "past" | "today" | "upcoming";
  status: "upcoming" | "under" | "over";
}

function currentMonth() {
  const now = new Date();

  return `${String(now.getFullYear())}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function DailySpend() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [incomeCategories, setIncomeCategories] = useState<any[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [month, setMonth] = useState(currentMonth());
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(0);
  const [days, setDays] = useState<DayItem[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayItem | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        setIncomeCategories(
          (res.data.data || []).filter((c: any) => c.type == "income"),
        );
      } catch {}
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getDailySpend({
          month,
          category: category == "all" ? "all" : category,
        });

        const data = res.data.data;

        setMonthlyIncome(data.monthly_income || 0);
        setDailyLimit(data.daily_limit || 0);
        setDays(data.days || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load Daily spend");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [month, category]);

  const cardClass = (d: DayItem) => {
    if (d.kind === "today") {
      return "rounded-xl border-2 border-[#7C3AED] bg-[#EDE9FE] shadow-md";
    }
    if (d.kind === "upcoming") {
      return "rounded-xl border border-[#CBD5E1] bg-[#F1F5F9]";
    }
    if (d.status === "over") {
      return "rounded-xl border border-[#FECDD3] bg-[#FFE4E6] shadow-sm";
    }
    return "rounded-xl border border-[#99F6E4] bg-[#fff] shadow-sm";
  };

  return (
    <div className="p-4 md:p-6 bg-[#EEFCF8] min-h-[calc(100vh-4rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#134E4A]">Daily Spend</h1>
        <p className="text-sm text-[#5B7A76]">
          Monthly income divided across days
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
          <label className="block text-xs text-[#5B7A76] mb-1">
            Income source
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-[#99F6E4] bg-white rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All income</option>
            {incomeCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-2xl border border-[#99F6E4] bg-white p-2.5 shadow-sm">
          <p className="text-xs text-[#5B7A76]">Monthly income</p>
          <p className="text-md font-bold text-[#134E4A]">
            ₹{Number(monthlyIncome).toFixed(0)}
          </p>
        </div>
        <div className="rounded-2xl border border-[#99F6E4] bg-white p-2.5 shadow-sm">
          <p className="text-xs text-[#5B7A76]">Daily limit</p>
          <p className="text-md font-bold text-[#0F766E]">
            ₹{Number(dailyLimit).toFixed(0)}
          </p>
        </div>
      </div>

      {monthlyIncome <= 0 && !loading && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 text-amber-800 text-sm border border-amber-100">
          Add income for this month to see daily limits. Expenses still show
          below.
        </div>
      )}

      {error && (
        <div className="mb-3 p-3 bg-rose-50 text-[#E11D48] rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-3 text-[11px]">
        <span className="px-2 py-1 rounded-full bg-[#EDE9FE] text-[#7C3AED] font-medium">
          Today
        </span>
        <span className="px-2 py-1 rounded-full border border-[#CBD5E1] bg-[#fff] text-[#0F766E] font-medium">
          Under spent
        </span>
        <span className="px-2 py-1 rounded-full bg-[#FFE4E6] text-[#E11D48] font-medium">
          Over spent
        </span>
        <span className="px-2 py-1 rounded-full border border-[#CBD5E1] bg-[#F1F5F9] text-[#64748B] font-medium">
          Upcoming
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-[#5B7A76]">Loading...</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-7 gap-1 sm:gap-2 mb-2">
          {days.map((d) => (
            <div className = {`flex flex-col justify-between ${cardClass(d)}`}>
              <div
                key={d.date}
                className={`p-2.5 min-h-[80px]`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-md font-bold text-[#134E4A]">
                    {d.date.slice(-2)}
                  </span>
                  <span className="text-[13px] text-[#5B7A76] capitalize">
                    {d.day.slice(0, 3)}
                  </span>
                </div>

                <hr className="text-[#9ea2a7]" />

                {d.kind === "upcoming" ? (
                  <p className="mt-2 flex items-center gap-1 text-xs font-medium text-[#64748B]">
                    <UpcomingIcon /> Upcoming
                  </p>
                ) : (
                  <>
                    <p className="mt-2 flex items-center gap-1 text-xs text-[#475569]">
                      <SpentIcon />
                      <span className="font-semibold text-[#134E4A]">
                        ₹{Number(d.spent).toFixed(0)}
                      </span>
                    </p>
                    <p
                      className={`mt-1 flex items-center gap-1 text-[10px] sm:text-xs font-semibold ${
                        d.status === "over"
                          ? "text-[#E11D48]"
                          : "text-[#0F766E]"
                      }`}
                    >
                      {d.status === "over" ? (
                        <OverSpentIcon />
                      ) : (
                        <UnderSpentIcon />
                      )}
                      {d.status === "over" ? "Over spent" : "Under spent"}
                    </p>
                    <p
                      className={`mt-0.5 ms-4 text-[10px] sm:text-xs font-semibold ${
                        d.status === "over"
                          ? "text-[#E11D48]"
                          : "text-[#0F766E]"
                      }`}
                    >
                      {" "}
                      (₹{Math.abs(d.remaining)})
                    </p>
                  </>
                )}
                {/* {d.kind === "today" && (
                <span className="block mt-0.5 text-[10px] text-center font-bold text-[#7C3AED]">
                  TODAY
                </span>

              )} */}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedDay(d)}
                  className="border-t  p-1 mt-auto w-[100%] flex justify-center items-center gap-2 text-xs text-[#64748B] hover:text-[#7C3AED]"
                  title="View day"
                >
                  <EyeIcon /> Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DayDetailModal
        open={selectedDay !== null}
        day={selectedDay}
        onClose={() => setSelectedDay(null)}
      />
    </div>
  );
}

export default DailySpend;

function SpentIcon() {
  return (
    <svg
      className="inline"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10" />
      <path d="M9 10.5c0-1 1.5-1.5 3-1.5s3 .5 3 1.5-1.5 1.5-3 1.5-3 .5-3 1.5 1.5 1.5 3 1.5 3-.5 3-1.5" />
    </svg>
  );
}

function OverSpentIcon() {
  return (
    <svg
      className="inline"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 4.2L1.8 19a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
    </svg>
  );
}

function UnderSpentIcon() {
  return (
    <svg
      className="inline"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function UpcomingIcon() {
  return (
    <svg
      className="inline"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
