import axios from "axios";
import { Tool, Category } from "@/types/tool";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Helper: Get Auth Header
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
 
};

// Fetch all tools
export const fetchTools = async (): Promise<Tool[]> => {
  const { data } = await axios.get(`${API_URL}/tools`, {
    headers: getAuthHeaders(),
  });
  return data.data;
};

// Create tool (with file upload support)
export const createTool = async (toolData: FormData): Promise<Tool> => {
  const { data } = await axios.post(`${API_URL}/tools`, toolData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("✅ Tool Created:", data);
  return data.data;
};

// Update tool (with file upload support)
export const updateTool = async (
  id: string,
  toolData: FormData
): Promise<Tool> => {
  const { data } = await axios.put(`${API_URL}/tools/${id}`, toolData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("🛠️ Tool Updated:", data);
  return data.data;
};

// Delete tool
export const deleteTool = async (id: string): Promise<void> => {
  const { data } = await axios.delete(`${API_URL}/tools/${id}`, {
    headers: getAuthHeaders(),
  });
  console.log("🗑️ Tool Deleted:", data);
};

// Add category
export const addCategory = async (
  toolId: string,
  category: Category
): Promise<void> => {
  const { data } = await axios.post(
    `${API_URL}/tools/${toolId}/categories`,
    category,
    { headers: getAuthHeaders() }
  );
  console.log("📁 Category Added:", data);
};
