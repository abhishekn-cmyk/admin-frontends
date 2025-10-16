import axiosInstance from "@/lib/axiosInstance";
import { TLogin, TSuperAdmin, TResetPassword } from "@/types/api";

export const postLogin = async (formData: TLogin) => {
  const res = await axiosInstance.post("/super-admin/login", {
    ...formData,
  });

  return res.data;
};

export const postSignup = async (formData: TLogin) => {
  const res = await axiosInstance.post("/super-admin/signup", {
    ...formData,
  });

  return res.data;
};

export const getAllSuperAdmin = async () => {
  const res = await axiosInstance.get("/super-admin/");

  return res.data;
};

export const postForgotPassword = async (email: string) => {
  const res = await axiosInstance.post("/super-admin/forgot-password", {
    email,
  });

  return res.data;
};

export const patchTResetPassword = async (formData: TResetPassword) => {
  const res = await axiosInstance.patch(
    "/super-admin/reset-password",
    formData,
  );
  return res.data;
};

export const updateProfile = async (formData: Partial<TSuperAdmin>) => {
  const res = await axiosInstance.patch("/super-admin/profile", formData);

  return res.data;
};

export const updateSuperAdmin = async (formData: TSuperAdmin, id: string) => {
  const res = await axiosInstance.patch(`/super-admin/${id}`, formData);

  return res.data;
};

export const deleteSuperAdmin = async (id: string) => {
  const res = await axiosInstance.delete(`/super-admin/${id}`);

  return res.data;
};
