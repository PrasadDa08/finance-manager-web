import { useState } from "react";
import { confirmRecurring, skipRecurring } from "../api/recurring";
import { useToastStore } from "../store/toastStore";

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function DueRecurringModal({
  open,
  items,
  onClose,
  onUpdated,
}: {
  open: boolean;
  items: any[];
  onClose: () => void;
  onUpdated: (id: number) => void;
}) {
  const [actingId, setActingId] = useState<number | null>(null);
  const showToast = useToastStore((s) => s.show);
  const month = currentMonth();

  if (!open) return null;

  const handleConfirm = async (id: number) => {
    try {
      setActingId(id);
      await confirmRecurring(id, { month });
      showToast("Transaction added", "success");
      onUpdated(id);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to add", "error");
    } finally {
      setActingId(null);
    }
  };

  const handleSkip = async (id: number) => {
    try {
      setActingId(id);
      await skipRecurring(id, { month });
      showToast("Skipped for this month", "success");
      onUpdated(id);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to skip", "error");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white border border-[#99F6E4] rounded-2xl p-4 shadow-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-lg font-bold text-[#134E4A]">Due this month</h2>
            <p className="text-xs text-[#5B7A76]">
              Add a transaction or skip for this month only
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#5B7A76] text-xl px-1"
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-[#5B7A76] py-4">Nothing due</p>
        ) : (
          <div className="space-y-3 mt-3">
            {items.map((t) => (
              <div
                key={t.id}
                className="border border-[#99F6E4] rounded-xl p-3"
              >
                <p className="font-semibold text-[#134E4A]">
                  {t.category?.name || "Category"} · ₹
                  {Number(t.amount).toFixed(0)}
                </p>
                <p className="text-xs text-[#5B7A76] mb-2">
                  {t.account?.name} · Day {t.day_of_month}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={actingId === t.id}
                    onClick={() => handleConfirm(t.id)}
                    className="flex-1 bg-[#0D9488] text-white text-sm py-2 rounded-lg disabled:opacity-60"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    disabled={actingId === t.id}
                    onClick={() => handleSkip(t.id)}
                    className="flex-1 border border-[#99F6E4] text-[#5B7A76] text-sm py-2 rounded-lg disabled:opacity-60"
                  >
                    Skip this month
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

export default DueRecurringModal;
