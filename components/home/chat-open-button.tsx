"use client";

import { Sparkles } from "lucide-react";

import { useOpenChat } from "@/components/chat/use-open-chat";
import { Button } from "@/components/ui/button";

export function ChatOpenButton() {
  const openChat = useOpenChat();

  return (
    <Button
      type="button"
      size="icon-lg"
      className="rounded-full shadow-lg"
      aria-label="Abrir chatbot"
      onClick={() => openChat()}
    >
      <Sparkles className="size-6" />
    </Button>
  );
}
