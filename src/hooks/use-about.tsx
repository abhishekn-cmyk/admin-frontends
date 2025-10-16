import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as aboutAPI from "@/api/about";
import { toast } from "sonner";
import { AboutType } from "@/types/about";

export const useAbout = () => {
  const queryClient = useQueryClient();

  // Fetch abouts - CORRECTED: Use meta for error handling
  const { data: abouts = [], isLoading, error } = useQuery<AboutType[], Error>({
    queryKey: ["abouts"],
    queryFn: aboutAPI.fetchAbouts,
    meta: {
      onError: (err: Error) => toast.error(err.message),
    },
  });

  // Save / edit mutation
  const saveMutation = useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: any }) =>
      id ? aboutAPI.updateAbout(id, payload) : aboutAPI.createAbout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["abouts"] });
      toast.success("About saved successfully!");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to save About"),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => aboutAPI.deleteAbout(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["abouts"] });
      toast.success("About deleted successfully!");
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to delete About"),
  });

  return { abouts, isLoading, error, saveMutation, deleteMutation };
};