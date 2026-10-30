import api from "./axios";

export const sendFeedback = (data: {
  type: "feedback" | "bug" | "suggestion";
  message: string;
  page?: string;
}) => api.post("/api/feedback", data);
