import { useState, useEffect } from "react";
import { getDailySpend } from "../api/dailySpend";
import { getCategories } from "../api/categories";

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
  console.log(incomeCategories);
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
      return "border-[#7C3AED] bg-[#F5F3FF] ring-2 ring-[#7C3AED]/30";
    }
    if (d.kind === "upcoming") {
      return "border-[#9ea2a7] bg-[#dfdfdf] opacity-80";
    }
    if (d.status === "over") {
      return "border-[#FECDD3] bg-[#FFF1F2]";
    }
    return "border-[#99F6E4] bg-white";
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
        <div className="bg-white border border-[#99F6E4] rounded-lg p-2">
          <p className="text-xs text-[#5B7A76]">Monthly income</p>
          <p className="text-md font-bold text-[#134E4A]">
            ₹{Number(monthlyIncome).toFixed(0)}
          </p>
        </div>
        <div className="bg-white border border-[#99F6E4] rounded-lg p-2">
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

      <div className="flex flex-wrap gap-3 mt-4 text-xs text-[#5B7A76] mb-3">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 bg-[#F5F3FF] border border-[#7C3AED]" />{" "}
          Today
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 bg-[#FFF1F2] border border-[#FECDD3]" /> Over
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 bg-[#dfdfdf] border border-[#9ea2a7]" />{" "}
          Upcoming
        </span>
        <span className="flex items-center gap-1">
          <SpentIcon /> Spent Rs.
        </span>
        <span className="flex items-center gap-1 text-[#0F766E]">
          <UnderSpentIcon /> Under Limit
        </span>
        <span className="flex items-center gap-1 text-[#E11D48]">
          <OverSpentIcon /> Over Limit
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-[#5B7A76]">Loading...</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-7 gap-1 sm:gap-2 mb-2">
          {days.map((d) => (
            <div
              key={d.date}
              className={` border p-2.5 min-h-[100px] ${cardClass(d)}`}
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
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 gap-2 flex items-center">
                    <UpcomingIcon/>
                  <span>Upcoming</span>
                </p>
              ) : (
                <>
                  <p className="text-xs sm:text-sm text-[#5B7A76] mt-2 mb-2 gap-2 flex items-center">
                    <SpentIcon /> <span>₹{Number(d.spent).toFixed(0)}</span>
                  </p>
                  <p
                    className={`text-xs sm:text-sm font-medium mt-1 gap-2 flex items-center ${
                      d.status === "over" ? "text-[#E11D48]" : "text-[#0F766E]"
                    }`}
                  >
                    {d.status === "over" ? (
                      <OverSpentIcon />
                    ) : (
                      <UnderSpentIcon />
                    )}{" "}
                    <span>₹{Math.abs(Number(d.remaining)).toFixed(0)}</span>
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
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
      strokeWidth="2.2"
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
      strokeWidth="2.2"
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
      strokeWidth="2.2"
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
      strokeWidth="2.2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
