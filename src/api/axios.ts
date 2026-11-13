import axios from "axios";
import { getToken } from "../utils/authStorage";

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: "http://localhost:8000",
  withCredentials: true, // Important for cookies
  withXSRFToken: true, // Important for Axios 1.x
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
