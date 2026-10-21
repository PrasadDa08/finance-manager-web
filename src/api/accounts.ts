import api from "./axios";

export const getAccounts = () => {
  return api.get("/api/accounts");
};

export const createAccount = (data: {
  name: string;
  type: string;
  opening_balance?: number;
  currency: string;
  is_active: boolean;
}) => {
  return api.post("/api/accounts", data);
};

export const getAccount = (id: number) => {
  return api.get(`/api/accounts/${id}`);
};

export const updateAccount = (
  id: number,
  data: {
    name?: string;
    type?: string;
    opening_balance?: number;
    currency?: string;
    is_active?: boolean;
  },
) => {
  return api.put(`/api/accounts/${id}`, data);
};

export const deleteAccount = (id: number) => {
  return api.delete(`/api/accounts/${id}`);
};
