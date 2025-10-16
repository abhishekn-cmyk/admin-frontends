import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Exam } from "@/types/exam";
import type { IMentor } from "@/types/mentor"; // Make sure you have a Mentor type
import { fetchExams, createExam, updateExam, deleteExam } from "@/api/exam";
import { fetchMentors } from "@/api/mentor"; // API function to fetch mentors

interface UseExamsOptions {
  fetchMentorsEnabled?: boolean; // Optional flag to conditionally fetch mentors
}

export function useExams(options?: UseExamsOptions) {
  const queryClient = useQueryClient();
  const { fetchMentorsEnabled = true } = options || {};

  const {
    data: exams = [],
    isLoading: examsLoading,
    error: examsError,
  } = useQuery<Exam[], Error>({
    queryKey: ["exams"],
    queryFn: fetchExams,
  });

  // -----------------------------
  // Fetch mentors
  // -----------------------------
  const {
    data: mentorsList = [],
    isLoading: mentorsLoading,
    error: mentorsError,
  } = useQuery<IMentor[], Error>({
    queryKey: ["mentors"],
    queryFn: fetchMentors,
    enabled: fetchMentorsEnabled,
  });

  // -----------------------------
  // Add Exam
  // -----------------------------
  const addExam = useMutation({
    mutationFn: createExam,
    onSuccess: () => {
      toast.success("Exam Added Successfully");
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
    onError: () => toast.error("Failed to add exam"),
  });

  const updateExamMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Exam> }) =>
      updateExam(id, payload),
    onSuccess: () => {
      toast.success("Exam Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
    onError: () => toast.error("Failed to update exam"),
  });

  const deleteExamMutation = useMutation({
    mutationFn: deleteExam,
    onSuccess: () => {
      toast.success("Exam Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
    onError: () => toast.error("Failed to delete exam"),
  });

  return {
    exams,
    isLoading: examsLoading, // <-- alias,
    examsError,
    mentorsList,
    mentorsLoading,
    mentorsError,
    addExam,
    updateExamMutation,
    deleteExamMutation,
  };
}
