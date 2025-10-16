import axiosInstance from "@/lib/axiosInstance";
import { Bundle } from "@/types/bundle";

export const getBundles = async (): Promise<Bundle[]> => {
  const { data } = await axiosInstance.get("/product");
  return data.data;
};

export const createBundle = async (bundle: Omit<Bundle, "_id">) => {
  const { data } = await axiosInstance.post("/product", bundle);
  return data.data;
};

export const updateBundle = async (id: string, bundle: Omit<Bundle, "_id">) => {
  const { data } = await axiosInstance.put(`/product/${id}`, bundle);
  return data.data;
};

export const deleteBundle = async (id: string) => {
  await axiosInstance.delete(`/product/${id}`);
};
