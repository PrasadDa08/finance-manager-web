import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { deleteCategory, getCategories } from "../api/categories";

interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
  color: string | null;
  icon: string | null;
  is_default: boolean;
  user_id: number | null;
}

function Categories() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories();
        setCategories(response.data.data);
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
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete category");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F3FF]">
        <p className="text-[#64748B]">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3FF] p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1E293B]">Categories</h1>
          <Link
            to="/categories/create"
            className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6D28D9] transition"
          >
            + Add Category
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-100 text-[#F43F5E] rounded-lg">
            {error}
          </div>
        )}

        {categories.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-[#E9D5FF] text-[#64748B]">
            No categories yet.
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white p-4 rounded-2xl border border-[#E9D5FF] flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold text-[#1E293B]">
                    {category.name}
                  </h2>
                  <p className="text-sm text-[#64748B] capitalize">
                    {category.type}
                    {category.is_default ? " · System" : ""}
                  </p>
                </div>

                {!category.is_default && category.user_id !== null && (
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/categories/${category.id}/edit`}
                      className="text-sm text-[#7C3AED] hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-sm text-[#F43F5E] hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Categories;
