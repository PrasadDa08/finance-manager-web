import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getCategory, updateCategory } from "../api/categories";
import { useEffect, useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["income", "expense"]),
  icon: z.string().optional(),
  color: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

function EditCategory() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setFetching(true);
        const response = getCategory(Number(id));
        const category = (await response).data.data;

        reset({
          name: category.name,
          type: category.type,
          icon: category.icon || "",
          color: category.color || "",
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load category");
      } finally {
        setFetching(false);
      }
    };

    fetchCategory();
  }, [id, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setLoading(true);
      setError(null);

      await updateCategory(Number(id), data);

      navigate("/categories");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F3FF]">
        <p className="text-[#64748B]">Loading category...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-[#E9D5FF]">
        <h1 className="text-3xl font-bold text-[#1E293B] mb-2 text-center">
          Edit Category
        </h1>
        <p className="text-center text-[#64748B] mb-6">
          Update category details
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-100 text-[#F43F5E] rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-[#1E293B]">
              Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full border border-[#E9D5FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
            {errors.name && (
              <p className="text-[#F43F5E] text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#1E293B]">
              Type
            </label>
            <select
              {...register("type")}
              className="w-full border border-[#E9D5FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#1E293B]">
              Icon (optional)
            </label>
            <input
              type="text"
              {...register("icon")}
              className="w-full border border-[#E9D5FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#1E293B]">
              Color (optional)
            </label>
            <input
              type="text"
              {...register("color")}
              className="w-full border border-[#E9D5FF] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7C3AED] text-white py-2.5 rounded-lg hover:bg-[#6D28D9] transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Category"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/categories")}
            className="w-full border border-[#E9D5FF] text-[#64748B] py-2.5 rounded-lg hover:bg-[#F5F3FF] transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditCategory;
