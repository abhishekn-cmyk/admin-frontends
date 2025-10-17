import {
  deleteSuperAdmin,
  getAllSuperAdmin,
  postLogin,
  postSignup,
  updateProfile,
  updateSuperAdmin,
} from "@/api/superAdmin";
import useAuthStore from "@/store/authStore";
import { TLogin, TSignup, TSuperAdmin } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  return useMutation({
    mutationFn: (formData: TLogin) => postLogin(formData),
    onSuccess: (data) => {
      toast.success("Login successful!");
      const { name, email, token } = data?.data;
      localStorage.setItem("token",token);
      localStorage.setItem("email",email);
      login({ name: name, email: email, token: token });
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error(
        error.response.data.message || "An error occurred while logging in.",
      );
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: TSignup) => postSignup(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin"] });
      toast.success("Super admin created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response.data.message ||
          "An error occurred while creating super admin.",
      );
    },
  });
};

export const useSuperAdmin = () => {
  return useQuery({
    queryFn: () => getAllSuperAdmin(),
    queryKey: ["super-admin"],
  });
};

export const useUpdateSuperAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, id }: { formData: TSuperAdmin; id: string }) =>
      updateSuperAdmin(formData, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin"] });
      toast.success("Super admin updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response.data.message ||
          "An error occurred while updated super admin",
      );
    },
  });
};

export const useDeleteSuperAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSuperAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin"] });
      toast.success("Super admin deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete failed", error);
    },
  });
};

export const useUpdateProfile = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: ({ formData }: { formData: Partial<TSuperAdmin> }) =>
      updateProfile(formData),
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");
      const { name, email, token } = data?.data;
      login({ name, email, token });
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "An error occurred while updating the profile.",
      );
    },
  });
};
