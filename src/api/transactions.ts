import api from "./axios";

export const getTransactions = () => {
  return api.get("/api/transactions");
};

export const createTransaction = (data: {
  account_id: number;
  category_id: number;
  type: "income" | "expense";
  amount: number;
  note?: string;
  transaction_date: string;
}) => {
  return api.post("/api/transactions", data);
};

export const getTransaction = (id: number) => {
  return api.get(`/api/transactions/${id}`);
};

export const updateTransaction = (
  id: number,
  data: {
    account_id: number;
    category_id: number;
    type: "income" | "expense";
    amount: number;
    note?: string;
    transaction_date: string;
  },
) => {
  return api.put(`/api/transactions/${id}`, data);
};

export const deleteTransaction = (id: number) => {
  return api.delete(`/api/transactions/${id}`);
};
