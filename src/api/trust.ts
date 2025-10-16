import axiosInstance from "@/lib/axiosInstance";
import { EnterpriseSolution } from "@/types/trust";

export const fetchTrustSolutions = async (): Promise<EnterpriseSolution[]> => {
  const res = await axiosInstance.get("/trust");
  return res.data.data ?? [];
};

export const createTrustSolution = (data: EnterpriseSolution) => {
  return axiosInstance.post("/trust", data);
};

export const updateTrustSolution = (id: string, data: EnterpriseSolution) => {
  return axiosInstance.put(`/trust/${id}`, data);
};

export const deleteTrustSolution = (id: string) => {
  return axiosInstance.delete(`/trust/${id}`);
};
