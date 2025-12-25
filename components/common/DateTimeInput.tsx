"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

// Format ISO string to dd/mm/yyyy hh:mm:ss
const formatDateTimeFromISO = (isoString: string): string => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  } catch {
    return "";
  }
};

// Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
const isoToDateTimeLocal = (isoString: string): string => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}`;
  } catch {
    return "";
  }
};

// Convert datetime-local format (YYYY-MM-DDTHH:mm) to ISO string
const dateTimeLocalToISO = (dateTimeLocal: string): string => {
  if (!dateTimeLocal) return "";
  try {
    const date = new Date(dateTimeLocal);
    if (isNaN(date.getTime())) return "";
    return date.toISOString();
  } catch {
    return "";
  }
};

interface DateTimeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const DateTimeInput = ({ 
  value, 
  onChange, 
  placeholder = "dd/mm/yyyy hh:mm:ss", 
  className = "" 
}: DateTimeInputProps) => {
  const dateTimeInputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState("");

  // Update display value when value prop changes
  useEffect(() => {
    if (value) {
      setDisplayValue(formatDateTimeFromISO(value));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleTextInputClick = () => {
    // Trigger click on hidden datetime-local input
    if (dateTimeInputRef.current) {
      try {
        // Try to use showPicker() if available (modern browsers)
        if (typeof dateTimeInputRef.current.showPicker === 'function') {
          dateTimeInputRef.current.showPicker();
        } else {
          // Fallback to click
          dateTimeInputRef.current.click();
        }
      } catch (error) {
        // Fallback to click if showPicker fails
        dateTimeInputRef.current.click();
      }
    }
  };

  const handleDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isoString = dateTimeLocalToISO(event.target.value);
    if (isoString) {
      onChange(isoString);
    }
  };

  return (
    <div className="relative">
      {/* Hidden datetime-local input */}
      <input
        ref={dateTimeInputRef}
        type="datetime-local"
        value={value ? isoToDateTimeLocal(value) : ""}
        onChange={handleDateTimeChange}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        tabIndex={-1}
        aria-hidden="true"
      />
      {/* Visible text input with custom format */}
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={displayValue}
          readOnly
          onClick={handleTextInputClick}
          className={`cursor-pointer pr-10 ${className}`}
        />
        <Calendar 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" 
        />
      </div>
    </div>
  );
};

