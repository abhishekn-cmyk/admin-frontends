import { useState } from "react";
import { Input } from "./input";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
};

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press enter",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="space-y-2 rounded border px-2 py-1">
      {value?.map((tag) => (
        <div
          key={tag}
          className="bg-card flex items-center gap-1 rounded border px-2 py-2 text-sm justify-between"
        >
          {tag}
          <button
            type="button"
            className="font-bold text-red-500 text-2xl cursor-pointer"
            onClick={() => removeTag(tag)}
          >
            ×
          </button>
        </div>
      ))}
      <Input
        className="w-full min-w-[100px] flex-1 border-none focus:ring-0"
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
