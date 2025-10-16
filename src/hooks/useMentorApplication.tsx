import {
  approveMentorApplication,
  deleteMentorApplication,
  getMentorApplication,
  rejectMentorApplication,
} from "@/api/mentorApplication";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useMentorApplication = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryFn: () => getMentorApplication(page, limit),
    queryKey: ["mentor-application", page, limit],
    placeholderData: keepPreviousData,
  });
};

export const useDeleteSuperAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMentorApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-application"] });
      toast.success("Mentor application deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete failed", error);
    },
  });
};

export const useApproveMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveMentorApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-application"] });
      toast.success("Mentor approved successfully");
    },
    onError: (error: any) => {
      console.error("Approve failed", error);
      toast.error("Failed to approve mentor");
    },
  });
};

export const useRejectMentor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Accept an object with id and remarks
    mutationFn: (data: { id: string; remarks: string }) =>
      rejectMentorApplication(data.id, data.remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-application"] });
      toast.success("Mentor rejected successfully");
    },
    onError: (error: any) => {
      console.error("Reject failed", error);
      toast.error("Failed to reject mentor");
    },
  });
};
