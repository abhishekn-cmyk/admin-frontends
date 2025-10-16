import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type ServicesProps = {
  control: any;
  name?: string;
  label?: string;
  defaultValue?: string;
};

export default function Services({
  control,
  name = "category",
  label = "Category",
  defaultValue,
}: ServicesProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              // RHF wiring
              onValueChange={field.onChange}
              defaultValue={field.value || defaultValue}
            >
              <SelectTrigger className="w-full border">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Project Financing">
                  Project Financing
                </SelectItem>
                <SelectItem value="Project Management">
                  Project Management
                </SelectItem>
                <SelectItem value="Operational Excellence">
                  Operational Excellence
                </SelectItem>
                <SelectItem value="Sustainability">Sustainability</SelectItem>
                <SelectItem value="HSSE and Risk">HSSE and Risk</SelectItem>
                <SelectItem value="Operations">
                  Mergers and Acquisitions (M&A)
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
