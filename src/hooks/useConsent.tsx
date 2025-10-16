// src/hooks/useConsent.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  saveConsent,
  getConsent,
  adminCreateConsent,
  adminGetAllConsents,
  adminUpdateConsent,
} from "@/api/consent";
import { IConsent } from "@/types/consent";

// ✅ Public Hooks
export const useSaveConsent = () =>
  useMutation({
    mutationFn: saveConsent,
  });

export const useGetConsent = () =>
  useQuery<IConsent>({
    queryKey: ["consent", "me"],
    queryFn: getConsent,
  });

// ✅ Admin Hooks
export const useAdminGetAllConsents = () =>
  useQuery<IConsent[]>({
    queryKey: ["admin", "consents"],
    queryFn: adminGetAllConsents,
  });

export const useAdminCreateConsent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminCreateConsent,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "consents"] }),
  });
};

export const useAdminUpdateConsent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<IConsent> & { userId?: string; ipAddress?: string }) =>
      adminUpdateConsent(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "consents"] }),
  });
};
