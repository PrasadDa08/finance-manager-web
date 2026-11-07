import api from "./axios";

export const getDailySpend = (params?: {
  month?: string;
  category?: string | number;
}) => {
  return api.get("/api/dailyspend", { params });
};

export const getDailySummary = (date?:string) => {
  return api.get("/api/daily-summary", { params: {date} });
};
