import axiosInstance from "@/lib/axiosInstance";
import { Tool } from "@/types/tool";
import { Category } from "@/types/tool";
// Fetch all tools
export const fetchTools = async (): Promise<Tool[]> => {
  const { data } = await axiosInstance.get("/tools");
  return data.data;
};

// Create tool (with file upload support)
export const createTool = async (toolData: FormData): Promise<Tool> => {
  const { data } = await axiosInstance.post("/tools", toolData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

// Update tool (with file upload support)
export const updateTool = async (
  id: string,
  toolData: FormData,
): Promise<Tool> => {
  const { data } = await axiosInstance.put(`/tools/${id}`, toolData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

// Delete tool
export const deleteTool = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/tools/${id}`);
};

export const addCategory = async (
  toolId: string,
  category: Category,
): Promise<void> => {
  await axiosInstance.post(`/tools/${toolId}/categories`, category);
};
