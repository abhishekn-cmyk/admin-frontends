import axios from "axios";
import { AboutType } from "@/types/about";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to get Authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem("token"); // adjust key if different
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all Abouts
export const fetchAbouts = async (): Promise<AboutType[]> => {
  const res = await axios.get(`${API_URL}/about`, {
    headers: { ...getAuthHeader() },
  });
  return res.data?.data ?? [];
};

// Create new About
export const createAbout = async (payload: Partial<AboutType>): Promise<AboutType> => {
  const res = await axios.post(`${API_URL}/about`, payload, {
    headers: { ...getAuthHeader(), "Content-Type": "application/json" },
  });
  return res.data;
};

// Update existing About
export const updateAbout = async (id: string, payload: Partial<AboutType>): Promise<AboutType> => {
  const res = await axios.put(`${API_URL}/about/${id}`, payload, {
    headers: { ...getAuthHeader(), "Content-Type": "application/json" },
  });
  return res.data;
};

// Delete About
export const deleteAbout = async (id: string): Promise<{ message: string }> => {
  const res = await axios.delete(`${API_URL}/about/${id}`, {
    headers: { ...getAuthHeader() },
  });
  return res.data;
};
