"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function WorkoutDayBackButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      className="size-6 rounded-full p-0 text-foreground hover:bg-transparent hover:text-foreground"
      onClick={() => router.back()}
      aria-label="Voltar"
    >
      <ChevronLeft className="size-6" />
    </Button>
  );
}
