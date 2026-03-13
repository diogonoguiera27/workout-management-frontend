"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Chat } from "@/components/home/chat";

type ChatProviderProps = {
  children: ReactNode;
};

export function ChatProvider({ children }: ChatProviderProps) {
  const pathname = usePathname();

  return (
    <NuqsAdapter>
      {children}
      {pathname === "/onboarding" ? null : <Chat />}
    </NuqsAdapter>
  );
}
