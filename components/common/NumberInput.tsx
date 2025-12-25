"use client";

import { Input } from "@/components/ui/input";
import { Hash } from "lucide-react";

interface NumberInputProps {
  value: number | string;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput = ({ 
  value, 
  onChange, 
  placeholder = "Nhập số", 
  className = "",
  min,
  max,
  step = 1
}: NumberInputProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue === "") {
      onChange(0);
      return;
    }
    const numValue = Number(inputValue);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  return (
    <div className="relative">
      <Input
        type="number"
        placeholder={placeholder}
        value={value || ""}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className={`pr-10 ${className}`}
      />
      <Hash 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" 
      />
    </div>
  );
};

