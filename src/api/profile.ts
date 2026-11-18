import api from "./axios";

export const getProfile = () => api.get("/api/profile");

export const updateProfile = (data: { name: string; phone?: string | null }) =>
  api.put("/api/profile", data);

export const updatePassword = (data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}) => api.put("/api/profile/password", data);
