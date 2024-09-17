import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { getServerSession } from "next-auth";

import TopNav from "@/components/hud/TopNav";
import AppContextProvider from "@/components/providers/app-provider";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { authOptions } from "@/lib/next-auth";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Samwel's Template",
  description: "Next JS full-stack template w/ shadcn/ui and supabase",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <AppContextProvider session={session}>
          <TopNav />

          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}
