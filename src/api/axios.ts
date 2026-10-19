import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // Important for cookies
  withXSRFToken: true, // Important for Axios 1.x
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
