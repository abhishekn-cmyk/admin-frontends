import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { patchTResetPassword } from "@/api/superAdmin";
import AuthLayout from "@/layout/AuthLayout";
import { CardContent } from "@/components/ui/card";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form";

export const formSchema = z
  .object({
    otp: z.string().min(4, { message: "OTP must be at least 4 digits" }),
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function TResetPassword() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: patchTResetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully");
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to reset password");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate({ password: values.confirmPassword, otp: values.otp });
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      description="Enter your email and password to login"
    >
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="otp">Otp</Label>
                  <FormControl>
                    <Input id="otp" placeholder="Enter a otp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="newPassword">New Password</Label>
                  <FormControl>
                    <Input
                      id="newPassword"
                      placeholder="Enter a new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <FormControl>
                    <Input
                      id="confirmPassword"
                      placeholder="Enter a confirm password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Resetting..." : "Reset Password"}
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={() => navigate("/login")}
                className="w-full text-sm"
              >
                Back to Login
              </Button>
            </>
          </form>
        </Form>
      </CardContent>
    </AuthLayout>
  );
}
