import { useToastStore } from "../store/toastStore";

function Toast() {
  const message = useToastStore((s) => s.message);
  const type = useToastStore((s) => s.type);
  const hide = useToastStore((s) => s.hide);

  if (!message) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`px-4 py-3 rounded-xl shadow-lg text-white text-sm ${
          type === "success" ? "bg-emerald-600" : "bg-rose-500"
        }`}
      >
        <div className="flex items-center gap-3">
          <span>{message}</span>
          <button onClick={hide} className="opacity-80 hover:opacity-100">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast;
