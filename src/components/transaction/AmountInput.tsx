import { Input } from "@/components/ui/input";
import { memo } from "react";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const AmountInput = memo(function AmountInput({
  value,
  onChange,
}: AmountInputProps) {
  return (
    <Input
      type="number"
      placeholder="Amount ($)"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  );
});
