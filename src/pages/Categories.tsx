import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, deleteCategory } from "../api/categories";
import { useToastStore } from "../store/toastStore";

interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
  icon?: string | null;
  color?: string | null;
  is_default: boolean;
  user_id: number | null;
}

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories();
        setCategories(response.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Delete this category?");
    if (!confirmed) return;

    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast("Category deleted", "success");
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Failed to delete category",
        "error",
      );
    }
  };

  return (
    <div className="p-4 md:p-6 bg-[#EEFCF8] min-h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-[#134E4A]">Categories</h1>
          <button
            type="button"
            onClick={() => setShowInfo(true)}
            className="w-6 h-6 rounded-full border border-[#99F6E4] bg-white text-[#0D9488] text-xs font-bold"
            title="What is a category?"
          >
            i
          </button>
        </div>

        <Link
          to="/categories/create"
          className="bg-[#7C3AED] text-white text-sm px-3 py-2 rounded-lg hover:bg-[#6D28D9]"
        >
          + Add
        </Link>
      </div>

      {error && (
        <div className="mb-3 p-3 bg-rose-50 text-[#E11D48] rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[#5B7A76]">Loading categories...</p>
      ) : categories.length === 0 ? (
        <div className="bg-white border border-[#99F6E4] rounded-2xl p-4">
          <p className="font-semibold text-[#134E4A] mb-1">No categories yet</p>
          <p className="text-sm text-[#5B7A76] mb-3">
            Add income and expense categories to organize your transactions.
          </p>
          <Link
            to="/categories/create"
            className="inline-block bg-[#0D9488] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0F766E]"
          >
            Add category
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#99F6E4] rounded-2xl overflow-hidden divide-y divide-[#CCFBF1]">
          {categories.map((category) => {
            const isSystem = category.is_default || category.user_id === null;

            return (
              <div
                key={category.id}
                className={`px-3 py-3 flex items-start justify-between gap-3 ${
                  isSystem ? "bg-[#F8FAFC]" : "bg-white"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{
                      backgroundColor:
                        category.color ||
                        (category.type === "income" ? "#0F766E" : "#E11D48"),
                      color: getContrastText(
                        category.color ||
                          (category.type === "income" ? "#0F766E" : "#E11D48"),
                      ),
                    }}
                  >
                    {category.name?.charAt(0)?.toUpperCase() || "C"}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#134E4A] truncate">
                      {category.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full ${
                          category.type === "income"
                            ? "bg-[#CCFBF1] text-[#0F766E]"
                            : "bg-[#FFE4E6] text-[#E11D48]"
                        }`}
                      >
                        {category.type}
                      </span>
                      {isSystem && (
                        <span className="text-[11px] text-[#5B7A76]">
                          System
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!isSystem && (
                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      to={`/categories/${category.id}/edit`}
                      className="text-xs text-[#7C3AED] hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-xs text-[#E11D48] hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Info modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-[#99F6E4] p-4">
            <h2 className="text-lg font-bold text-[#134E4A] mb-2">
              What is a category?
            </h2>
            <p className="text-sm text-[#5B7A76] mb-3">
              Categories explain why money moved — like Salary, Food, Rent, or
              Shopping. Use Income for money coming in, and Expense for money
              going out.
            </p>
            <button
              onClick={() => setShowInfo(false)}
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

function getContrastText(bgColor?: string) {
  if (!bgColor) return "#ffffff";

  const hex = bgColor.replace("#", "");
  if (hex.length !== 6) return "#ffffff";

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // perceived brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 160 ? "#134E4A" : "#ffffff";
}

export default Categories;
