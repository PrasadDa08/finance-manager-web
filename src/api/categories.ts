import api from "./axios";

export const getCategories = () => {
  return api.get("/api/categories");
};

export const createCategory = (data: {
  name: string;
  type: "income" | "expense";
  icon?: string;
  color?: string;
}) => {
  return api.post("/api/categories", data);
};

export const getCategory = (id: number) => {
  return api.get(`/api/categories/${id}`);
};

export const updateCategory = (
  id: number,
  data: {
    name: string;
    type?: "income" | "expense";
    color?: string;
    icon?: string;
  },
) => {
  return api.put(`/api/categories/${id}`, data);
};

export const deleteCategory = (id: number) => {
  return api.delete(`/api/categories/${id}`);
};
