import { useEffect, useState } from "react";
import { useToastStore } from "../store/toastStore";
import {
  confirmRecurring,
  deleteRecurring,
  getRecurringDue,
  getRecurrings,
  skipRecurring,
} from "../api/recurring";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

function currentMonth() {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function Recurring() {
  const [month, setMonth] = useState(currentMonth());
  const [due, setDue] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const showToast = useToastStore((s) => s.show);

  const load = async () => {
    try {
      setLoading(true);
      const [dueRes, listRes] = await Promise.all([
        getRecurringDue(month),
        getRecurrings(),
      ]);

      setDue(dueRes.data.data || []);
      setTemplates(listRes.data.data || []);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to load", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [month]);

  const handleConfirm = async (id: number) => {
    try {
      setActingId(id);
      await confirmRecurring(id, { month });
      showToast("Transaction added", "success");
      setDue((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      showToast(err.response?.data?.data || "Failed to add", "error");
    } finally {
      setActingId(null);
    }
  };

  const handleSkip = async (id: number) => {
    try {
      setActingId(id);
      await skipRecurring(id, { month });
      showToast("Transaction added", "success");
      setDue((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      showToast(err.response?.data?.data || "Failed to add", "error");
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async () => {
    if (deleteId == null) return;

    try {
      setDeleting(true);
      await deleteRecurring(deleteId);
      setTemplates((prev) => prev.filter((t) => t.id !== deleteId));
      setDue((prev) => prev.filter((t) => t.id !== deleteId));
      showToast("Template deleted", "success");
      setDeleteId(null);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to delete", "error");
    } finally {
      setDeleting(false);
    }
  };
  return (
    <div className="p-4 md:p-6 bg-[#EEFCF8] min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#134E4A]">Recurring</h1>
          <p className="text-sm text-[#5B7A76]">
            Due items and monthly templates
          </p>
        </div>
        <Link
          to="/recurring/create"
          className="bg-[#7C3AED] text-white text-sm px-3 py-2 rounded-lg"
        >
          + Add
        </Link>
      </div>

      <div className="mb-4">
        <label className="block text-xs text-[#5B7A76] mb-1">Month</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-[#99F6E4] bg-white rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {loading ? (
        <p className="text-sm text-[#5B7A76]">Loading...</p>
      ) : (
        <>
          {/* Due */}
          <h2 className="text-sm font-bold text-[#134E4A] mb-2">
            Due this month
          </h2>
          {due.length === 0 ? (
            <div className="bg-white border border-[#99F6E4] rounded-2xl p-4 mb-6 text-sm text-[#5B7A76]">
              Nothing due this month
            </div>
          ) : (
            <div className="space-y-2 mb-6">
              {due.map((t) => (
                <div
                  key={t.id}
                  className="bg-white border border-[#99F6E4] rounded-2xl p-3"
                >
                  <p className="font-semibold text-[#134E4A]">
                    {t.category?.name || "Category"} · ₹
                    {Number(t.amount).toFixed(0)}
                  </p>
                  <p className="text-xs text-[#5B7A76] mb-2">
                    {t.account?.name} · Day {t.day_of_month}
                    {t.note ? ` · ${t.note}` : ""}
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

          {/* Templates */}
          <h2 className="text-sm font-bold text-[#134E4A] mb-2">
            My templates
          </h2>
          {templates.length === 0 ? (
            <div className="bg-white border border-[#99F6E4] rounded-2xl p-4 text-sm text-[#5B7A76]">
              No templates yet. Add rent, salary, SIP…
            </div>
          ) : (
            <div className="space-y-2">
              {templates.map((t) => (
                <div
                  key={t.id}
                  className="bg-white border border-[#99F6E4] rounded-2xl p-3 flex justify-between gap-2"
                >
                  <div>
                    <p className="font-semibold text-[#134E4A]">
                      {t.category?.name || "Category"} · ₹
                      {Number(t.amount).toFixed(0)}
                    </p>
                    <p className="text-xs text-[#5B7A76]">
                      Day {t.day_of_month}
                      {!t.is_active ? " · Inactive" : ""}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <Link
                      to={`/recurring/${t.id}/edit`}
                      className="text-[#7C3AED]"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteId(t.id)}
                      className="text-[#E11D48] text-left"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmModal
        open={deleteId !== null}
        title="Delete template?"
        message="Past confirms stay. This stops future dues."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

export default Recurring;
