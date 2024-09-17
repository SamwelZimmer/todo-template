import React, { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { SearchInput } from "./TextInputs";
import { cn } from "@/lib/utils";

interface DropdownProps {
  label?: string;
  placeholder: string;
  value?: string;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  onChange: (value: any) => void;
  className?: string;
  required?: boolean;
  header?: React.ReactNode;
}

export default function DefaultDropdown({
  label,
  placeholder,
  value,
  options,
  onChange,
  className = "",
  required = false,
  header,
}: DropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label htmlFor={label} className="text-zinc-200">
          {label}

          {required && <span className="text-zinc-500"> *</span>}
        </Label>
      )}

      <DropdownMenu
        open={dropdownOpen}
        onOpenChange={() => setDropdownOpen(!dropdownOpen)}
      >
        <DropdownMenuTrigger
          id={label}
          className={cn(
            "h-12 rounded-[16px] px-4 py-3 bg-card text-primary flex items-center border shadow-sm",
            dropdownOpen
              ? "ring-inset ring-1 ring-foreground border-foreground"
              : "border-border",
            "hover:bg-muted transition-colors",
            className
          )}
        >
          <span
            className={`w-full text-left text-sm ${
              !value && "text-muted-foreground"
            }`}
          >
            {value || placeholder}
          </span>

          <LuChevronDown
            size={16}
            className={`text-inherit min-w-4 text-zinc-400 transition-all duration-300 ${
              dropdownOpen && "rotate-90"
            }`}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-card w-full min-w-full rounded-2xl"
          style={{
            width: "var(--radix-dropdown-menu-trigger-width)",
            maxHeight: "var(--radix-dropdown-menu-content-available-height)",
          }}
        >
          {header}

          <div
            className={`flex flex-col gap-1 max-h-64 overflow-scroll ${
              options.length > 0 && header && "pt-1"
            } `}
          >
            {options.map((option, i) => (
              <DropdownMenuItem
                key={i}
                className="flex gap-2 cursor-pointer w-full rounded-xl"
                onClick={() => onChange(option)}
              >
                {option.icon}
                <span className="font-medium">{option.label}</span>
              </DropdownMenuItem>
            ))}
          </div>

          {options.length === 0 && (
            <div className="flex items-center justify-center h-10 text-zinc-400 pt-1 text-sm">
              No items found
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
