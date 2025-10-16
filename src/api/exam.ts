import axiosInstance from "@/lib/axiosInstance";
import { Exam } from "@/types/exam";

// Fetch all exams
export const fetchExams = async (): Promise<Exam[]> => {
  const res = await axiosInstance.get("/exam/exams");
  return res.data.data || [];
};
export const fetchMentors = async () => {
  const res = await axiosInstance.get("/mentor");
  return res.data.data || [];
};
// Add new exam
export const createExam = async (payload: Partial<Exam>): Promise<Exam> => {
  const res = await axiosInstance.post("/exam/exams", payload);
  return res.data.data;
};

// Update exam
export const updateExam = async (
  id: string,
  payload: Partial<Exam>,
): Promise<Exam> => {
  const res = await axiosInstance.put(`/exam/exams/${id}`, payload);
  return res.data.data;
};

// Delete exam
export const deleteExam = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/exam/exams/${id}`);
};
