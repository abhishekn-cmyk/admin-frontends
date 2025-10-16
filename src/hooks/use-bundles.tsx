import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bundle } from "@/types/bundle";
import { getBundles, createBundle, updateBundle, deleteBundle } from "@/api/bundles";

export const useBundles = () => {
  const queryClient = useQueryClient();

  // Fetch all bundles
  const { data: bundles = [], isLoading, isError } = useQuery<Bundle[], Error>({
    queryKey: ["bundles"],
    queryFn: getBundles,
  });

  // Add / Update bundle
  const saveBundle = useMutation({
    mutationFn: async (bundle: Omit<Bundle, "_id"> & { _id?: string }) => {
      if (bundle._id) {
        return updateBundle(bundle._id, bundle);
      } else {
        return createBundle(bundle);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bundles"] }),
  });

  // Delete bundle
  const deleteBundleMutation = useMutation({
    mutationFn: (id: string) => deleteBundle(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bundles"] }),
  });

  return {
    bundles,
    isLoading,
    isError,
    saveBundle,
    deleteBundle: deleteBundleMutation,
  };
};
