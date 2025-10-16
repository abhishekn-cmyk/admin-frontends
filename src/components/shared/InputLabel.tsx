import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

type InputLabelProps = {
  label: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const InputLabel = ({
  id,
  type = "text",
  value,
  label,
  placeholder,
  onChange,
  readOnly = false,
  className,
  ...props
}: InputLabelProps) => {
  return (
    <div className={cn("w-full space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className="w-full"
        {...props}   
      />
    </div>
  );
};

export default InputLabel;
