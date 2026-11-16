import api from "./axios";

export const getReport = (params?: {
  month?: string;
  account_id?: string | number;
}) => {
  return api.get("/api/reports", { params });
};
