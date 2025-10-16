import {
  createPricing,
  deletePricing,
  getAllPricing,
  updatePricing,
} from "@/api/pricing";
import { TPricing } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreatePricing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: TPricing) => createPricing(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing"] });
      toast.success("Pricing created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response.data.message ||
          "An error occurred while creating pricing.",
      );
    },
  });
};

export const usePricing = () => {
  return useQuery({
    queryFn: () => getAllPricing(),
    queryKey: ["pricing"],
  });
};

export const useUpdatePricing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, id }: { formData: TPricing; id: string }) =>
      updatePricing(formData, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing"] });
      toast.success("Pricing updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response.data.message ||
          "An error occurred while updated super admin",
      );
    },
  });
};

export const useDeletePricing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePricing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing"] });
      toast.success("Pricing deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete failed", error);
    },
  });
};
