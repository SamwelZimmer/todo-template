"use client";

import { createContext, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";

import { useMounted } from "@/hooks/use-mounted";
import ServerLoadingPage from "@/components/misc/ServerLoadingPage";
import ThemeProvider from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/styles/globals.css";

interface AppContextProviderProps {
  children: ReactNode;
  session: Session | null;
}

export interface AppContextType {}

// Provide a default context object that matches the type AppContextType
const defaultContextValue: AppContextType = {};

export const AppContext = createContext<AppContextType>(defaultContextValue);

const AppContextProvider = ({ children, session }: AppContextProviderProps) => {
  const mounted = useMounted();
  const pathname = usePathname();

  // TODO: reimplement or move to middleware
  if (!session?.user && pathname !== "/enter") {
    redirect("/enter");
  }

  if (pathname === "/enter" && session?.user) {
    redirect("/todo");
  }

  const valueObj: AppContextType = {};

  if (mounted) {
    return (
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <AppContext.Provider value={valueObj}>
              {children}
            </AppContext.Provider>
          </TooltipProvider>
        </ThemeProvider>

        <Toaster richColors />
      </SessionProvider>
    );
  }

  return <ServerLoadingPage />;
};

export default AppContextProvider;
