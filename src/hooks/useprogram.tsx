import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMentors } from "@/api/mentor";
import { fetchPrograms, createProgram, updateProgram, deleteProgram } from "@/api/program";
import {  IProgram } from "@/types/program";
import { IMentor } from "@/types/mentor";
import { toast } from "sonner";

// Fetch mentors
export const useMentors = () => {
  return useQuery<IMentor[]>({
    queryKey: ["mentors"],
    queryFn: fetchMentors,
    initialData: [],
  });
};


// Fetch programs
export const usePrograms = () => {
  return useQuery<IProgram[]>({
    queryKey: ["programs"],
    queryFn: fetchPrograms,
    initialData: [], // ✅ fixes map issue
  });
};

// Update program
export const useUpdateProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateProgram(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Program updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update program");
    },
  });
};

// Create program
export const useCreateProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createProgram(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Program created successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create program");
    },
  });
};

// Delete program
export const useDeleteProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProgram,
    onSuccess: () => {
      toast.success("Program deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete program");
    },
  });
};
