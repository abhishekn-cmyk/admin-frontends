import {
  deleteUser,
  getUsers,
  getUserStats,
  postUser,
  updateUser,
} from "@/api/user";
import { TUser } from "@/types/api";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useUsers = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryFn: () => getUsers(page, limit),
    queryKey: ["user", page, limit],
    placeholderData: keepPreviousData,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: TUser) => postUser(formData),
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response.data.message || "An error occurred while creating user",
      );
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, id }: { formData: TUser; id: string }) =>
      updateUser(formData, id),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response.data.message || "An error occurred while updated user",
      );
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete failed", error);
    },
  });
};

export const useUserStats = (id: string) => {
  return useQuery({
    queryFn: () => getUserStats(id),
    queryKey: ["user", id],
    enabled: !!id,
  });
};
