import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Important for cookies
  withXSRFToken: true, // Important for Axios 1.x
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
