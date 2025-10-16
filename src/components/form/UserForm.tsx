import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TUser } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser, useUpdateUser } from "@/hooks/useUser";

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  homeCountry: z.string().min(1, "Home country is required"),
  yearsOfExperience: z.coerce.number().min(0),
  primaryGoal: z.string().min(1, "Primary goal is required"),
  medicalBackground: z.string().optional(),
  agreeToTerms: z.boolean().refine((v) => v, "You must agree"),
  subscribeToUpdates: z.boolean(),
  role: z.literal("User"),
});

export type UserFormValues = z.infer<typeof userSchema>;

type UserFormProps = {
  isOpen: boolean;
  onClose: () => void;
  user?: TUser | null;
  onSuccess?: () => void | Promise<void>;
};

export default function UserForm({ isOpen, onClose, user }: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      homeCountry: "",
      yearsOfExperience: 0,
      primaryGoal: "",
      medicalBackground: "",
      agreeToTerms: false,
      subscribeToUpdates: false,
      role: "User",
    },
    values: user ?? undefined, // <-- prefill on edit
  });

  const { mutate: post } = useCreateUser();
  const { mutate: update } = useUpdateUser();

  const onSubmit = (values: UserFormValues) => {
    if (user?._id) {
      update(
        { formData: values, id: user._id },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } else {
      post(values, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-xl sm:max-w-lg">
        <DialogHeader className="space-y-2 border-b pb-4">
          <DialogTitle className="text-xl font-semibold">
            {user ? "Edit User" : "Add User"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {user
              ? "Update the user details and click save."
              : "Fill out the form below to create a new user."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 pt-4"
          >
            {/* First & Last Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone + Country */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="homeCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Home Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Experience + Goal */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primaryGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Goal</FormLabel>
                    <FormControl>
                      <Input placeholder="Primary Goal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Medical Background */}
            <FormField
              control={form.control}
              name="medicalBackground"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Background</FormLabel>
                  <FormControl>
                    <Input placeholder="Medical Background" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Checkboxes */}
            <div className="mt-2 flex flex-col gap-3">
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">I agree to terms</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subscribeToUpdates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">
                      Subscribe to updates
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-lg px-4 py-2"
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-lg px-4 py-2">
                {user ? "Save Changes" : "Create User"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
