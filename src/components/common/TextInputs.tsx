"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IconButton } from "@/components/common/Buttons";
import {
  RiCloseFill,
  RiEyeLine,
  RiEyeOffLine,
  RiSearchLine,
} from "react-icons/ri";

interface InputProps {
  value: string;
  setValue: (_value: string) => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  disabled?: boolean;
}

interface DefaultTextInputProps extends InputProps {
  label?: string;
  type?: string;
  required?: boolean;
}

export default function DefaultTextInput({
  value,
  setValue,
  placeholder,
  className,
  maxLength,
  label,
  type = "text",
  required = false,
}: DefaultTextInputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <Label htmlFor={label}>
          {label}

          {required && <span className="text-slate-500"> *</span>}
        </Label>
      )}
      <Input
        id={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cn(
          "h-12 rounded-[16px] px-4 py-3 bg-card text-primary",
          "text-body-medium-bold placeholder:text-body-medium",
          "outline-none ring-inset focus:ring-2 focus:ring-foreground",
          "hover:bg-muted",
          "focus-visible:border-foreground",
          "disabled:hover:bg-foreground",
          "placeholder:select-none",
          className
        )}
      />
    </div>
  );
}

interface PasswordInputProps extends InputProps {
  label?: string;
}

export function PasswordInput({
  value,
  setValue,
  placeholder,
  className,
  maxLength,
  label,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const ref = useRef<null | HTMLInputElement>(null);

  const togglePassword = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    setShowPassword((prev) => !prev);

    // Focus and move cursor to the end after a short delay
    setTimeout(() => {
      if (ref.current) {
        ref.current.focus();
        const length = ref.current.value.length;
        ref.current.setSelectionRange(length, length);
      }
    }, 0);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <Label htmlFor={label}>{label}</Label>}

      <div
        onClick={() => ref.current?.focus()}
        className={cn(
          "h-12 rounded-[16px] pl-1 pr-3 py-3 bg-card text-primary flex items-center border",
          "hover:bg-muted transition-colors",
          focused
            ? "ring-inset ring-1 ring-foreground border-foreground"
            : "border-border",
          className
        )}
      >
        <Input
          ref={ref}
          id={label}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "bg-transparent border-none focus-visible:outline-none focus-visible:ring-0 shadow-none",
            className
          )}
        />

        <IconButton
          icon={
            showPassword ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />
          }
          onClick={(e) => togglePassword(e)}
          className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-200 h-6 w-6 rounded-sm bg-transparent dark:hover:bg-transparent"
        />
      </div>
    </div>
  );
}

export const SearchInput = ({
  value,
  setValue,
  placeholder,
  className,
}: InputProps) => {
  const [focused, setFocused] = useState(false);

  const ref = useRef<null | HTMLInputElement>(null);
  return (
    <div
      onClick={() => ref.current?.focus()}
      className={cn(
        "h-12 rounded-[16px] px-3 py-3 bg-card text-primary flex items-center border",
        "hover:bg-muted transition-colors",
        focused
          ? "ring-inset ring-1 ring-foreground border-foreground"
          : "border-border",
        className
      )}
    >
      <RiSearchLine size={20} className="text-muted-foreground min-w-5" />
      <Input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "bg-transparent border-none focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 shadow-none",
          "focus:outline-none focus:ring-0 focus:border-none",
          className
        )}
      />

      {value && value.length > 0 && (
        <IconButton
          icon={<RiCloseFill size={16} />}
          onClick={() => setValue("")}
          className="text-muted-foreground hover:text-primary h-6 w-6 rounded-sm bg-transparent dark:hover:bg-transparent"
        />
      )}
    </div>
  );
};
