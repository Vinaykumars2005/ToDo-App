import axios from "axios";
import { BASE_URL } from "./config";

export const registerUser = async (email: string, password: string) => {
  return await axios.post(`${BASE_URL}/api/auth/register`, { email, password });
};

export const loginUser = async (email: string, password: string) => {
  return await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
};
