function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-white border border-[#99F6E4] rounded-2xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-[#134E4A] mb-2">{title}</h2>
        <p className="text-sm text-[#5B7A76] mb-4">{message}</p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border border-[#99F6E4] text-[#5B7A76] py-2.5 rounded-lg hover:bg-[#F0FDFA] disabled:opacity-60"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-[#E11D48] text-white py-2.5 rounded-lg hover:bg-[#BE123C] disabled:opacity-60"
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
