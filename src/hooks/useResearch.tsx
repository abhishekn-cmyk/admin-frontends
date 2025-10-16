import { useQuery } from "@tanstack/react-query";
import { fetchResearchCounts } from "@/api/research";
import { ICounts } from "@/types/research";

export const useResearchCounts = () => {
  return useQuery<ICounts>({
    queryKey: ["research-counts"],
    queryFn: fetchResearchCounts,
    initialData: {
      publications: 0,
      focusAreas: 0,
      partnerships: 0,
      participations: 0,
      proposals: 0,
    },
  });
};

