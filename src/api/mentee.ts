import axiosInstance from "@/lib/axiosInstance";
import { IMentee, CreateMenteeInput, UpdateMenteeInput } from "@/types/mentee";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Fetch all mentees
export const getMentees = async (): Promise<IMentee[]> => {
  const { data } =
    await axiosInstance.get<ApiResponse<IMentee[]>>("/mentor/mentees");
  return data.data;
};

// Fetch single mentee
export const getMentee = async (id: string): Promise<IMentee> => {
  const { data } = await axiosInstance.get<ApiResponse<IMentee>>(
    `${"/mentor/mentees"}/${id}`,
  );
  return data.data;
};

// Create mentee
export const createMentee = async (
  mentee: CreateMenteeInput,
): Promise<IMentee> => {
  const { data } = await axiosInstance.post<ApiResponse<IMentee>>(
    "/mentor/mentees",
    mentee,
  );
  return data.data;
};

// Update mentee
export const updateMentee = async (
  id: string,
  mentee: UpdateMenteeInput,
): Promise<IMentee> => {
  const { data } = await axiosInstance.put<ApiResponse<IMentee>>(
    `${"/mentor/mentees"}/${id}`,
    mentee,
  );
  return data.data;
};

// Delete mentee
export const deleteMentee = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/mentor/mentees/${id}`);
};
