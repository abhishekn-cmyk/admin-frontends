// src/hooks/useMentees.ts
import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getMentees,
  getMentee,
  createMentee,
  updateMentee,
  deleteMentee,
} from "@/api/mentee";
import { IMentee, CreateMenteeInput, UpdateMenteeInput } from "@/types/mentee";

// =====================
// Fetch all mentees
// =====================
export const useMentees = () =>
  useQuery<IMentee[], unknown>({
    queryKey: ["mentees"],
    queryFn: getMentees,
  });

// =====================
// Fetch single mentee
// =====================
export const useMentee = (id: string) =>
  useQuery<IMentee, unknown>({
    queryKey: ["mentee", id],
    queryFn: () => getMentee(id),
    enabled: !!id,
  });

// =====================
// Create mentee
// =====================
export const useCreateMentee = (): UseMutationResult<
  IMentee, // response type
  unknown, // error type
  CreateMenteeInput & { mentors: string[] }, // variables type
  unknown  // context type
> => {
  const queryClient = useQueryClient();

  return useMutation<IMentee, unknown, CreateMenteeInput & { mentors: string[] }, unknown>({
    mutationFn: createMentee,
    onSuccess: () => {
      toast.success("Mentee created successfully");
      queryClient.invalidateQueries({ queryKey: ["mentees"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error creating mentee");
    },
  });
};

// =====================
// Update mentee
// =====================
export const useUpdateMentee = (): UseMutationResult<
  IMentee, // response type
  unknown, // error type
  { id: string; data: UpdateMenteeInput }, // variables type
  unknown  // context type
> => {
  const queryClient = useQueryClient();

  return useMutation<IMentee, unknown, { id: string; data: UpdateMenteeInput }, unknown>({
    mutationFn: ({ id, data }) => updateMentee(id, data),
    onSuccess: (_, variables) => {
      toast.success("Mentee updated successfully");
      queryClient.invalidateQueries({ queryKey: ["mentees"] });
      queryClient.invalidateQueries({ queryKey: ["mentee", variables.id] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error updating mentee");
    },
  });
};

// =====================
// Delete mentee
// =====================
export const useDeleteMentee = (): UseMutationResult<
  void,     // response type
  unknown,  // error type
  string,   // variables type (mentee id)
  unknown   // context type
> => {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string, unknown>({
    mutationFn: (id: string) => deleteMentee(id),
    onSuccess: () => {
      toast.success("Mentee deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["mentees"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Error deleting mentee");
    },
  });
};
