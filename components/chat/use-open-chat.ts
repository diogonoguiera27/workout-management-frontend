"use client";

import { useQueryStates } from "nuqs";

import { chatQueryStateParsers } from "@/components/home/chat";

export function useOpenChat() {
  const [, setQueryState] = useQueryStates(chatQueryStateParsers);

  return (initialMessage?: string) => {
    void setQueryState({
      chat_open: true,
      chat_initial_message: initialMessage ?? null,
    });
  };
}
