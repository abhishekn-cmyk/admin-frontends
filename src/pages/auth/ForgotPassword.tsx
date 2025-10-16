import { postForgotPassword } from "@/api/superAdmin";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layout/AuthLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
});

export default function ForgotPassword() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      postForgotPassword(values.email),
    onSuccess: () => {
      toast.success("OTP sent to your email.");
      navigate("/reset-password");
    },
    onError: (error: any) => {
      toast.error(
        error.message || "An error occurred while sending the reset link.",
      );
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  return (
    <AuthLayout
      title="Forgot password"
      description="Enter your email address below and we'll send you otp to reset your password"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email</Label>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? "Sending..." : "Reset password"}
            </Button>
            <Button variant="link" onClick={() => navigate("/")}>
              Remember your password? Login
            </Button>
          </CardFooter>
        </form>
      </Form>
    </AuthLayout>
  );
}
