"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function AmountInput({
  value,
  onChange,
  className,
}: Readonly<AmountInputProps>) {
  const [inputValue, setInputValue] = useState(Math.abs(value).toString());
  const [isNegative, setIsNegative] = useState(value < 0);

  useEffect(() => {
    setInputValue(Math.abs(value).toString());
    setIsNegative(value < 0);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*\.?\d*$/.test(newValue) || newValue === "") {
      setInputValue(newValue);
      const numericValue = parseFloat(newValue) || 0;
      onChange(isNegative ? -numericValue : numericValue);
    }
  };

  const toggleSign = () => {
    setIsNegative(!isNegative);
    onChange(isNegative ? Math.abs(value) : -Math.abs(value));
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={className}
      />
      <button
        type="button"
        onClick={toggleSign}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500"
      >
        {isNegative ? "-" : "+"}
      </button>
    </div>
  );
}
