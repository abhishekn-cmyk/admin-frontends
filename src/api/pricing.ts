import axiosInstance from "@/lib/axiosInstance";
import { TPricing } from "@/types/api";

export const createPricing = async (formData: TPricing) => {
  const res = await axiosInstance.post("/pricing", {
    ...formData,
  });

  return res.data;
};

export const getAllPricing = async () => {
  const res = await axiosInstance.get("/pricing");

  return res.data;
};

export const updatePricing = async (formData: TPricing, id: string) => {
  const res = await axiosInstance.patch(`/pricing/${id}`, formData);

  return res.data;
};

export const deletePricing = async (id: string) => {
  const res = await axiosInstance.delete(`/pricing/${id}`);

  return res.data;
};
