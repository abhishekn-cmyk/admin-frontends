import axiosInstance from "@/lib/axiosInstance";
import { TUser } from "@/types/api";

export const postUser = async (formData: TUser) => {
  const res = await axiosInstance.post("/user", formData);

  return res.data;
};

export const getUsers = async (page: number = 1, limit: number = 10) => {
  const res = await axiosInstance.get(`/user/?limit=${limit}&page=${page}`);
  return res.data;
};

export const updateUser = async (formData: TUser, id: string) => {
  const res = await axiosInstance.patch(`/user/${id}`, formData);

  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await axiosInstance.delete(`/user/${id}`);

  return res.data;
};

export const getUserStats = async (id: string) => {
  const res = await axiosInstance.get(`/user/users/${id}/stats`);
  return res.data;
};
