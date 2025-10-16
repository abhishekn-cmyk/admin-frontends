import axiosInstance from "@/lib/axiosInstance";
import { IProgram } from "@/types/program";

// Create program
export const createProgram = async (formData: FormData): Promise<IProgram> => {
  const res = await axiosInstance.post("/program", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const updateProgram = async (id: string, formData: FormData): Promise<IProgram> => {
  const res = await axiosInstance.put(`/program/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};
export const fetchPrograms = async (): Promise<IProgram[]> => {
  const res = await axiosInstance.get("/program");
  return res.data?.data ?? [];
};

// Delete program
export const deleteProgram = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/program/${id}`);
};