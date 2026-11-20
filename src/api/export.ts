import api from "./axios";

export const exportTransactions = (params?: {
  month?: string;
  account_id?: string | number;
}) => {
  return api.get("/api/export/transactions", {
    params,
    responseType: "blob",
  });
};
