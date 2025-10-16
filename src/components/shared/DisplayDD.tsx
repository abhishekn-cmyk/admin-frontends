import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/select";

type DisplayDropdownProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function DisplayDropdown({
  value,
  onChange,
}: DisplayDropdownProps) {
  const handleSelectChange = (selectedValue: string) => {
    onChange(selectedValue === "true");
  };

  return (
    <div className="space-y-1.5">
      <Label>Display</Label>
      <Select
        onValueChange={handleSelectChange}
        value={value ? "true" : "false"}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a display" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {[
              { label: "Show", value: "true" },
              { label: "Hide", value: "false" },
            ].map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
