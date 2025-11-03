import axios from "axios";
import { BASE_URL } from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getTasks = async () => {
  return await axios.get(`${BASE_URL}/api/tasks`, await getAuthHeader());
};

export const addTask = async (taskData: any) => {
  return await axios.post(`${BASE_URL}/api/tasks`, taskData, await getAuthHeader());
};

export const deleteTask = async (taskId: string) => {
  return await axios.delete(`${BASE_URL}/api/tasks/${taskId}`, await getAuthHeader());
};

export const updateTask = async (taskId: string, taskData: any) => {
  return await axios.put(`${BASE_URL}/api/tasks/${taskId}`, taskData, await getAuthHeader());
};
