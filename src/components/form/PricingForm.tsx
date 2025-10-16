import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { TPricing } from "@/types/api";
import { useEffect } from "react";
import { useCreatePricing, useUpdatePricing } from "@/hooks/usePricing";
import SaveCancel from "../shared/SaveCancel";
import PublishStatusSelect from "../shared/PublishStatusSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TagInput } from "../ui/TagInput";

const formSchema = z.object({
  icon: z.string().min(1, "Icon is required"),
  title: z.string().min(1, "Title is required"),
  subTitle: z.string().min(1, "Subtitle is required"),
  monthlyPrice: z.coerce.number().min(0, "Monthly price must be >= 0"),
  yearlyPrice: z.coerce.number().min(0, "Yearly price must be >= 0"),
  benefits: z.array(z.string()).min(1, "At least one benefit is required"),
  popular: z.boolean(),
  order: z.coerce.number().min(0, "Order must be >= 0"),
  publish: z.boolean(),
});

type PricingFormValues = z.infer<typeof formSchema>;

const defaultValues: PricingFormValues = {
  icon: "",
  title: "",
  subTitle: "",
  monthlyPrice: 0,
  yearlyPrice: 0,
  benefits: [""],
  popular: false,
  order: 0,
  publish: true,
};

type PricingFormProps = {
  isOpen: boolean;
  onClose: () => void;
  pricing?: TPricing | null;
};

export default function PricingForm({ isOpen, onClose, pricing }: PricingFormProps) {
  const form = useForm<PricingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { mutate: post } = useCreatePricing();
  const { mutate: update } = useUpdatePricing();

  useEffect(() => {
    if (pricing) {
      form.reset(pricing);
    } else {
      form.reset(defaultValues);
    }
  }, [pricing]);

  const onSubmit = (values: PricingFormValues) => {
    if (pricing && pricing._id) {
      update(
        { id: pricing._id, formData: values },
        { onSuccess: () => onClose() },
      );
    } else {
      post(values, { onSuccess: () => onClose() });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {pricing ? "Edit Pricing Plan" : "Create Pricing Plan"}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Fill out the details below and click <span className="font-medium">Save</span> when done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            
            {/* Icon */}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon (SVG)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Paste SVG icon here" {...field} className="resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title + Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Plan title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input placeholder="Short description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="monthlyPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearlyPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yearly Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Benefits */}
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefits</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Type a benefit and press Enter"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Popular + Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="popular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Popular</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "true")}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Popular</SelectItem>
                        <SelectItem value="false">Not Popular</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Publish */}
            <PublishStatusSelect control={form.control} name="publish" />

            {/* Actions */}
            <SaveCancel />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
