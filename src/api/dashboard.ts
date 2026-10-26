import api from "./axios";

export const getDashboard = (params?: {
  period?: "all" | "this_week" | "this_month" | "this_year";
  account_id?: number;
  from_date?: string;
  to_date?: string;
}) => {
  return api.get("/api/dashboard", { params });
};
