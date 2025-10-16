// src/hooks/useMentors.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMentors, fetchMentorById, createMentor, updateMentor, deleteMentor, approveMentor } from "@/api/mentor";
import { IMentor } from "@/types/mentor";
import { toast } from "sonner";

// Fetch all mentors
export const useMentors = () => {
  return useQuery<IMentor[]>({
    queryKey: ["mentors"],
    queryFn: fetchMentors,
  });
};

// Fetch single mentor
export const useMentor = (id: string) => {
  return useQuery<IMentor>({
    queryKey: ["mentors", id],
    queryFn: () => fetchMentorById(id),
    enabled: !!id, // only run if id exists
  });
};

// Create mentor
export const useCreateMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMentor,
    onSuccess: () => {
      toast.success("Mentor created successfully");
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Error creating mentor");
    },
  });
};

// Update mentor
export const useUpdateMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMentor,
    onSuccess: () => {
      toast.success("Mentor updated successfully");
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Error updating mentor");
    },
  });
};

// Delete mentor
export const useDeleteMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMentor,
    onSuccess: () => {
      toast.success("Mentor deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Error deleting mentor");
    },
  });
};

export const useApproveMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveMentor,
    onSuccess: () => {
      toast.success("Mentor approved successfully");
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Error approving mentor");
    },
  });
};
