"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface ButtonProps {
  icon?: React.ReactNode;
  className?: string;
  onClick?: (e?: React.MouseEvent) => void;
}

interface DefaultButtonProps extends ButtonProps {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export default function DefaultButton({
  text,
  icon,
  className,
  onClick,
  variant,
}: DefaultButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      className={cn("font-semibold h-9 px-6 text-sm rounded-full", className)}
    >
      {icon}
      <span>{text}</span>
    </Button>
  );
}

export function IconButton({ icon, className, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md h-8 w-8 hover:bg-muted flex items-center justify-center",
        className
      )}
    >
      {icon}
    </button>
  );
}
