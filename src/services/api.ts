// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api",   // Vite proxy forwards /api → http://localhost:5128
  headers: { "Content-Type": "application/json" },
});

export default api;