import api from "./axios";

export const getCsrfCookie = () => {
  return api.get("/sanctum/csrf-cookie");
};

export const login = (data: { email: string; password: string }) => {
  return api.post("/api/login", data);
};

export const register = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return api.post("/api/register/request-otp", data);
};

export const verifyOtp = (data: { email: string; otp: string }) => {
  return api.post("/api/register/verify-otp", data);
};

export const logout = () => {
  return api.post("/api/logout");
};

export const user = () => {
  return api.get("/api/user");
};
