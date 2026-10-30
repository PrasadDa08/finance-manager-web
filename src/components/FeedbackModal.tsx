import { useState } from "react";
import { useToastStore } from "../store/toastStore";
import { sendFeedback } from "../api/feedback";



function FeedbackModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const showToast = useToastStore((s) => s.show);
  const [type, setType] = useState<"feedback" | "bug" | "suggestion">(
    "feedback",
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim().length < 5) {
      setError("Please write at least 5 characters");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await sendFeedback({
        type,
        message: message.trim(),
        page: window.location.pathname,
      });

      showToast("Thanks for your feedback", "success");
      setMessage("");
      setType("feedback");
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-md bg-white border border-[#99F6E4] rounded-2xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#134E4A]">Send feedback</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#5B7A76] hover:text-[#134E4A] text-xl leading-none"
          >
            ×
          </button>
        </div>

        <p className="text-sm text-[#5B7A76] mb-4">
          Share a suggestion, report a bug, or leave general feedback.
        </p>

        {error && (
          <div className="mb-3 p-3 rounded-xl bg-rose-50 text-[#E11D48] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-[#134E4A] mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="feedback">Feedback</option>
              <option value="suggestion">Suggestion</option>
              <option value="bug">Bug</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#134E4A] mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="What should we improve?"
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7C3AED] text-white py-2.5 rounded-lg hover:bg-[#6D28D9] transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeedbackModal;
