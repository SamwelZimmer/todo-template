"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useTheme } from "next-themes";

import { RiMoonClearLine, RiSunLine } from "react-icons/ri";

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex items-center justify-center"
    >
      {theme === "light" ? (
        <RiMoonClearLine size={20} />
      ) : (
        <RiSunLine size={20} />
      )}
    </button>
  );
}
