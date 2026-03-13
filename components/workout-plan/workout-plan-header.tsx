import { Goal } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";

type WorkoutPlanHeaderProps = {
  workoutPlanName: string;
};

export function WorkoutPlanHeader({
  workoutPlanName,
}: WorkoutPlanHeaderProps) {
  return (
    <header className="relative flex h-[296px] flex-col justify-between overflow-hidden rounded-b-[20px] px-5 pt-5 pb-10">
      <Image
        src="/workout-plan/banner-background.png"
        alt="Banner do plano de treino"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-bl from-transparent from-[32%] to-foreground to-[100%]" />

      <p className="relative font-anton text-[22px] leading-[1.15] text-background uppercase">
        Fit.ai
      </p>

      <div className="relative flex items-end justify-between gap-3">
        <div className="flex flex-col gap-3">
          <Badge className="h-[26px] rounded-full bg-primary px-2.5 py-[5px] text-background hover:bg-primary">
            <Goal className="size-4" />
            <span className="font-heading text-xs leading-none font-semibold tracking-normal">
              {workoutPlanName}
            </span>
          </Badge>

          <div className="flex flex-col gap-1.5">
            <h1 className="font-heading text-2xl leading-[1.05] font-semibold text-background">
              Plano de Treino
            </h1>
          </div>
        </div>

        <div className="min-h-1 min-w-1" />
      </div>
    </header>
  );
}
