import axios from "axios";

const API_URL = "http://localhost:5037/api/auth";

export interface LoginResponse {
  token: string;
  userName: string;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
    email,
    password,
  });

  return response.data;
};

export interface RegisterResponse {
  token: string;
  userName: string;
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>(`${API_URL}/register`, {
    email: email.trim().toLowerCase(),   // ✅ FIX
    password,
    firstName: name.trim(),
    lastName: "User"
  });

  return response.data;
};