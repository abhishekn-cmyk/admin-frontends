import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeading from "@/layout/PageHeading";
import useAuthStore from "@/store/authStore";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUpdateProfile } from "@/hooks/useSuperAdmin";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name can't be empty",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string(),
});

export default function Profile() {
  const { email, name } = useAuthStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name || "",
      email: email || "",
      password: "",
    },
  });

  const { mutate, isPending } = useUpdateProfile();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload: Partial<typeof values> = {
      name: values.name,
      email: values.email,
    };

    if (values.password.trim() !== "") {
      payload.password = values.password;
    }

    mutate({ formData: payload });
  };

  return (
    <>
      <PageHeading
        title="Profile"
        description="Add the profile details below. Click save when done."
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7 py-5">
          {[
            { id: "name", label: "Name" },
            { id: "email", label: "Email" },
          ].map((i) => (
            <FormField
              key={i.id}
              control={form.control}
              name={i.id as "name" | "email"}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor={i.id}>{i.label}</Label>
                  <FormControl>
                    <Input
                      id={i.id}
                      type={i.id}
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="password">Password</Label>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" disabled={isPending}>
            Save
          </Button>
        </form>
      </Form>
    </>
  );
}
