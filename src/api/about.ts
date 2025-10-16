import axiosInstance from "@/lib/axiosInstance";
import { AboutType } from "@/types/about";

// Fetch all Abouts
export const fetchAbouts = async (): Promise<AboutType[]> => {
  const res = await axiosInstance.get("/about");
  return res.data?.data ?? []; // return empty array if undefined
};

// Create new About
export const createAbout = async (
  payload: Partial<AboutType>,
): Promise<AboutType> => {
  const res = await axiosInstance.post("/about", payload);
  return res.data;
};

// Update existing About
export const updateAbout = async (
  id: string,
  payload: Partial<AboutType>,
): Promise<AboutType> => {
  const res = await axiosInstance.put(`/about/${id}`, payload);
  return res.data;
};

// Delete About
export const deleteAbout = async (id: string): Promise<{ message: string }> => {
  const res = await axiosInstance.delete(`/about/${id}`);
  return res.data;
};
