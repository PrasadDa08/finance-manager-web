import api from "./axios";

export const getBudgets = (month?: string) => {
  return api.get("/api/budgets", { params: month ? { month } : {} });
};

export const getBudget = (id: number) => {
  return api.get(`/api/budgets/${id}`);
};

export const createBudget = (data: {
  type: string;
  account_id: number | null;
  amount: number;
  month_start: string;
}) => {
  return api.post("/api/budgets", data);
};

export const updateBudget = (
  id: number,
  data: {
    type: string;
    account_id: number | null;
    amount: number;
    month_start: string;
  },
) => {
  return api.put(`/api/budgets/${id}`, data);
};

export const deleteBudget = (id: number) => {
  return api.delete(`/api/budgets/${id}`);
};
