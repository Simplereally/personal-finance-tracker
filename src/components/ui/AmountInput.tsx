"use client";

import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import React from "react";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function AmountInput({
  value,
  onChange,
  disabled = false,
  className = "",
}: AmountInputProps) {
  const [isIncome, setIsIncome] = React.useState(true);
  const { theme } = useTheme();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(newValue) || newValue === "") {
      onChange(newValue);
    }
  };

  const toggleTransactionType = () => {
    setIsIncome(!isIncome);
    onChange(value.startsWith("-") ? value.slice(1) : `-${value}`);
  };

  const getToggleButtonClass = () => {
    const baseClass =
      "absolute bottom-0 left-0 top-0 flex w-8 items-center justify-center rounded-l-md border-r";
    const incomeClass =
      theme === "dark"
        ? "bg-green-900 text-green-300"
        : "bg-[hsl(var(--toaster-success))] text-white";
    const expenseClass =
      theme === "dark"
        ? "bg-red-900 text-red-300"
        : "bg-[hsl(var(--toaster-error))] text-white";

    return `${baseClass} ${isIncome ? incomeClass : expenseClass}`;
  };

  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="decimal"
        placeholder="Amount"
        value={value.startsWith("-") ? value.slice(1) : value}
        onChange={handleAmountChange}
        disabled={disabled}
        className={`pl-10 ${className}`}
      />
      <button
        type="button"
        onClick={toggleTransactionType}
        className={getToggleButtonClass()}
        disabled={disabled}
      >
        {isIncome ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v12M6 12h12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 12h12"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
