// src/api/consent.ts
import axiosInstance from "@/lib/axiosInstance";
import { IConsent } from "@/types/consent";

// ✅ Public
export const saveConsent = async (data: Partial<IConsent>): Promise<IConsent> => {
  const res = await axiosInstance.post("/modal", data);
  return res.data.data;
};

export const getConsent = async (): Promise<IConsent> => {
  const res = await axiosInstance.get("/modal/me");
  return res.data.data;
};

// ✅ Admin
export const adminCreateConsent = async (data: Partial<IConsent>): Promise<IConsent> => {
  const res = await axiosInstance.post("/modal/admin", data);
  return res.data.data;
};

export const adminGetAllConsents = async (): Promise<IConsent[]> => {
  const res = await axiosInstance.get("/modal/admin");
  return res.data.data;
};

export const adminUpdateConsent = async (data: Partial<IConsent>): Promise<IConsent> => {
  const res = await axiosInstance.put(`/modal/admin/update-consent`, data);
  return res.data.data;
};
