import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = Array.from({ length: 3 }, (_, i) => 2024 + i);

interface TransactionFiltersProps {
  onFilterChange: (filters: {
    month: string | null;
    year: string | null;
  }) => void;
}

export function TransactionFilters({
  onFilterChange,
}: Readonly<TransactionFiltersProps>) {
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const currentYear = currentDate.getFullYear().toString();

  const [month, setMonth] = useState<string | null>(currentMonth);
  const [year, setYear] = useState<string | null>(currentYear);

  useEffect(() => {
    onFilterChange({ month, year });
  }, []); // Run only once on mount

  const handleMonthChange = (value: string) => {
    setMonth(value);
    onFilterChange({ month: value, year });
  };

  const handleYearChange = (value: string) => {
    setYear(value);
    onFilterChange({ month, year: value });
  };

  const clearFilters = () => {
    setMonth(null);
    setYear(null);
    onFilterChange({ month: null, year: null });
  };

  return (
    <div className="mb-4 flex items-center space-x-4">
      <Select value={month ?? ""} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m, index) => (
            <SelectItem key={m} value={(index + 1).toString().padStart(2, "0")}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={year ?? ""} onValueChange={handleYearChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={clearFilters} variant="outline">
        Clear Filters
      </Button>
    </div>
  );
}
