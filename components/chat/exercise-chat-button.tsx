"use client";

import { Button } from "@/components/ui/button";
import { useOpenChat } from "@/components/chat/use-open-chat";

type ExerciseChatButtonProps = {
  exerciseName: string;
};

export function ExerciseChatButton({
  exerciseName,
}: ExerciseChatButtonProps) {
  const openChat = useOpenChat();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className="rounded-full font-heading text-sm font-semibold"
      aria-label={`Perguntar como executar o exercicio ${exerciseName}`}
      onClick={() =>
        openChat(`Como executar o exercício ${exerciseName} corretamente?`)
      }
    >
      ?
    </Button>
  );
}
