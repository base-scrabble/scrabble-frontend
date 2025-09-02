
import axios from "axios";
import { API_BASE_URL } from "../config";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
});

// example helper
export async function health() {
  const res = await api.get("/api/health");
  return res.data;
}
