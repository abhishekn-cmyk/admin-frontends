import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EnterpriseSolution } from "@/types/trust";
import {
  fetchTrustSolutions,
  createTrustSolution,
  updateTrustSolution,
  deleteTrustSolution,
} from "@/api/trust";

export const useTrustSolutions = () => {
  return useQuery<EnterpriseSolution[]>({
    queryKey: ["trustSolutions"],
    queryFn: fetchTrustSolutions,
  });
};

export const useSaveTrustSolution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (solution: EnterpriseSolution) => {
      if (solution._id) return updateTrustSolution(solution._id, solution);
      return createTrustSolution(solution);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trustSolutions"] }),
  });
};

export const useDeleteTrustSolution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTrustSolution(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trustSolutions"] }),
  });
};
