import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../api/categories";
import { useToastStore } from "../store/toastStore";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["income", "expense"]),
  color: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const fieldHelp: Record<string, { title: string; body: string }> = {
  name: {
    title: "Category name",
    body: "A short label for this type of money movement, e.g. Salary, Food, Rent.",
  },
  type: {
    title: "Category type",
    body: "Income = money coming in. Expense = money going out.",
  },
  color: {
    title: "Color",
    body: "Used as the category badge color in lists. If empty, we set a default by type.",
  },
};

function CreateCategory() {
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.show);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [infoKey, setInfoKey] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type: "expense",
      color: "",
    },
  });

  const selectedType = watch("type");

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        name: data.name,
        type: data.type,
        color: data.color || (data.type === "income" ? "#0F766E" : "#E11D48"),
        icon: "default",
      };

      await createCategory(payload);
      showToast("Category created", "success");
      navigate("/categories");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to create category";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#EEFCF8] flex items-center justify-center p-4 md:p-6">
      <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm w-full max-w-md border border-[#99F6E4]">
        <h1 className="text-2xl font-bold text-[#134E4A] mb-1 text-center">
          Add Category
        </h1>
        <p className="text-center text-sm text-[#5B7A76] mb-5">
          Create an income or expense category
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-[#E11D48] rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <LabelWithInfo label="Name" onInfo={() => setInfoKey("name")} />
            <input
              type="text"
              {...register("name")}
              placeholder="e.g. Food, Salary"
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
            {errors.name && (
              <p className="text-[#E11D48] text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <LabelWithInfo label="Type" onInfo={() => setInfoKey("type")} />
            <select
              {...register("type")}
              className="w-full border border-[#99F6E4] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <LabelWithInfo
              label="Color (optional)"
              onInfo={() => setInfoKey("color")}
            />
            <div className="flex items-center gap-3">
              <input
                type="color"
                {...register("color")}
                className="w-10 h-10 border border-[#99F6E4] rounded-lg p-1 bg-white"
              />
              <p className="text-xs text-[#5B7A76]">
                Default: {selectedType === "income" ? "Teal" : "Rose"}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7C3AED] text-white py-2.5 rounded-lg hover:bg-[#6D28D9] transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Category"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/categories")}
            className="w-full border border-[#99F6E4] text-[#5B7A76] py-2.5 rounded-lg hover:bg-[#F0FDFA] transition"
          >
            Cancel
          </button>
        </form>
      </div>

      {infoKey && fieldHelp[infoKey] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-[#99F6E4] p-4">
            <h2 className="text-lg font-bold text-[#134E4A] mb-2">
              {fieldHelp[infoKey].title}
            </h2>
            <p className="text-sm text-[#5B7A76] mb-4">
              {fieldHelp[infoKey].body}
            </p>
            <button
              onClick={() => setInfoKey(null)}
              className="w-full bg-[#7C3AED] text-white text-sm py-2.5 rounded-lg hover:bg-[#6D28D9]"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LabelWithInfo({
  label,
  onInfo,
}: {
  label: string;
  onInfo: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-sm font-medium text-[#134E4A]">{label}</span>
      <button
        type="button"
        onClick={onInfo}
        className="w-5 h-5 rounded-full border border-[#99F6E4] text-[#0D9488] text-[10px] font-bold"
      >
        i
      </button>
    </div>
  );
}

export default CreateCategory;
