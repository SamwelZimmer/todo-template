"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { ModeToggle } from "@/components/providers/theme-provider";
import DefaultButton from "@/components/common/Buttons";
import { signOut, useSession } from "next-auth/react";

export default function TopNav() {
  const pathname = usePathname();
  const session = useSession();

  return (
    <nav className="fixed top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="w-full mx-auto px-4 sm:px-8 flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href={"/"} className="text-lg font-bold">
          Logo
        </Link>

        <div className="flex items-center gap-4">
          {!pathname.includes("/enter") &&
            (session.data?.user ? (
              <DefaultButton
                onClick={() => signOut()}
                text="Log Out"
                variant="secondary"
              />
            ) : (
              <Link href="/enter">
                <DefaultButton text="Log In" />
              </Link>
            ))}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
