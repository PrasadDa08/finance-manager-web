import api from "./axios";

export function getRecurrings() {
  return api.get("/api/recurring");
}

export const getRecurringTemplate = (id: number) =>
  api.get(`/api/recurring/${id}`);

export const getRecurringDue = (month?: string) =>
  api.get("/api/recurring-due", { params: month ? { month } : {} });

export function createRecurring(data: {
  category_id: number;
  account_id: number;
  type: string;
  amount: number;
  note?: string | null;
  day_of_month: number;
  start_month: string;
  end_month?: string | null;
  is_active?: boolean;
}) {
  return api.post("api/recurring", data);
}

export const updateRecurring = (id: number, data: Record<string, unknown>) => {
  return api.put(`api/recurring/${id}`, data);
};

export const deleteRecurring = (id: number) => api.delete(`api/recurring${id}`);

export const confirmRecurring = (id: number, data?: { month?: string }) => {
  return api.post(`api/recurring/${id}/confirm`, data || {});
};

export const skipRecurring = (id: number, data?: { month?: string }) => {
  return api.post(`api/recurring/${id}/skip`, data || {});
};
