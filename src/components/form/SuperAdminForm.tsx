import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TSuperAdmin } from "@/types/api";
import { useEffect } from "react";
import { useSignup, useUpdateSuperAdmin } from "@/hooks/useSuperAdmin";
import SaveCancel from "../shared/SaveCancel";

type SuperAdminFormProps = {
  isOpen: boolean;
  onClose: () => void;
  superAdmin?: TSuperAdmin | null;
};

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must contain at least 6 characters"),
});

const updateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().optional(),
});

type CreateSuperAdminFormValues = z.infer<typeof createSchema>;
type UpdateSuperAdminFormValues = z.infer<typeof updateSchema>;

const defaultValues = {
  name: "",
  email: "",
  password: "",
};

export default function SuperAdminForm({
  isOpen,
  onClose,
  superAdmin,
}: SuperAdminFormProps) {
  const isEdit = !!superAdmin;
  const form = useForm<CreateSuperAdminFormValues | UpdateSuperAdminFormValues>(
    {
      resolver: zodResolver(isEdit ? updateSchema : createSchema),
      defaultValues: defaultValues,
    },
  );

  const { mutate: post } = useSignup();
  const { mutate: update } = useUpdateSuperAdmin();

  useEffect(() => {
    if (superAdmin) {
      form.reset({ ...superAdmin, password: "" });
    } else {
      form.reset(defaultValues);
    }
  }, [superAdmin, form]);

  const onSubmit = (
    values: CreateSuperAdminFormValues | UpdateSuperAdminFormValues,
  ) => {
    if (isEdit && superAdmin?._id) {
      const { password, ...rest } = values;
      const formData = password ? values : rest;

      update(
        { id: superAdmin._id, formData },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } else {
      // ✅ TS now knows password exists
      post(values as CreateSuperAdminFormValues, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Super admin</DialogTitle>
          <DialogDescription>
            Make changes to your super admin. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SaveCancel />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
