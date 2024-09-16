import { Input } from "@/components/ui/input";
import { memo } from "react";

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const DescriptionInput = memo(function DescriptionInput({
  value,
  onChange,
}: DescriptionInputProps) {
  return (
    <Input
      type="text"
      placeholder="Description"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
});
