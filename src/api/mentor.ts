import axiosInstance from "@/lib/axiosInstance";
import { IMentor } from "@/types/mentor";

// Fetch all mentors
export const fetchMentors = async (): Promise<IMentor[]> => {
  const res = await axiosInstance.get("/mentor");
  return res.data?.data ?? [];
};

// Fetch single mentor
export const fetchMentorById = async (id: string): Promise<IMentor> => {
  const res = await axiosInstance.get(`/mentor/${id}`);
  return res.data;
};

// Create mentor
export const createMentor = async (payload: FormData): Promise<IMentor> => {
  const res = await axiosInstance.post("/mentor", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Update mentor
export const updateMentor = async ({
  id,
  data,
}: {
  id: string;
  data: FormData;
}): Promise<IMentor> => {
  const res = await axiosInstance.put(`/mentor/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
// Delete mentor
export const deleteMentor = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/mentor/${id}`);
};

export const approveMentor = async (id: string): Promise<void> => {
  await axiosInstance.patch(`/mentor/approve/${id}`, {
    approved: true,
  });
};
