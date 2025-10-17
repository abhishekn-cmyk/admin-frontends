import axios from "axios";
import { TLogin, TSuperAdmin, TResetPassword } from "@/types/api";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to get Authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem("token"); // adjust key if different
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const postLogin = async (formData: TLogin) => {
  const res = await axios.post(`${API_URL}/super-admin/login`, formData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const postSignup = async (formData: TLogin) => {
  const res = await axios.post(`${API_URL}/super-admin/signup`, formData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const getAllSuperAdmin = async () => {
  const res = await axios.get(`${API_URL}/super-admin/`, {
    headers: { ...getAuthHeader() },
  });
  return res.data;
};

export const postForgotPassword = async (email: string) => {
  const res = await axios.post(
    `${API_URL}/super-admin/forgot-password`,
    { email },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const patchTResetPassword = async (formData: TResetPassword) => {
  const res = await axios.patch(`${API_URL}/super-admin/reset-password`, formData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const updateProfile = async (formData: Partial<TSuperAdmin>) => {
  const res = await axios.patch(`${API_URL}/super-admin/profile`, formData, {
    headers: { ...getAuthHeader(), "Content-Type": "application/json" },
  });
  return res.data;
};

export const updateSuperAdmin = async (formData: TSuperAdmin, id: string) => {
  const res = await axios.patch(`${API_URL}/super-admin/${id}`, formData, {
    headers: { ...getAuthHeader(), "Content-Type": "application/json" },
  });
  return res.data;
};

export const deleteSuperAdmin = async (id: string) => {
  const res = await axios.delete(`${API_URL}/super-admin/${id}`, {
    headers: { ...getAuthHeader() },
  });
  return res.data;
};
