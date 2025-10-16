import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type TextareaLabelProps = {
  id?: string;
  value?: string | number;
  rows?: number;
  label: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
  className?: string;
};

const TextareaLabel = ({
  id,
  rows = 3,
  value,
  label,
  placeholder,
  onChange,
  readOnly = false,
  className,
}: TextareaLabelProps) => {
  return (
    <div className={cn("w-full space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        value={value}
        className="w-full"
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
  );
};

export default TextareaLabel;
