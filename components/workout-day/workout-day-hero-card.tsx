import { Calendar, Dumbbell, Timer } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

type WorkoutDayHeroCardProps = {
  name: string;
  coverImageUrl?: string;
  weekDayLabel: string;
  estimatedDurationInSeconds: number;
  exercisesCount: number;
  action?: ReactNode;
};

export function WorkoutDayHeroCard({
  name,
  coverImageUrl,
  weekDayLabel,
  estimatedDurationInSeconds,
  exercisesCount,
  action,
}: WorkoutDayHeroCardProps) {
  const estimatedMinutes = Math.floor(estimatedDurationInSeconds / 60);

  return (
    <section className="relative h-[200px] overflow-hidden rounded-xl">
      <Image
        src={coverImageUrl || "/home/today-workout-background.png"}
        alt={name}
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-foreground/80" />

      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="inline-flex w-fit items-center gap-1 rounded-full bg-background/20 px-2.5 py-1.5 backdrop-blur-lg">
          <Calendar className="size-3.5 text-background" />
          <span className="font-heading text-xs leading-none font-semibold tracking-[0.04em] text-background">
            {weekDayLabel}
          </span>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-2xl leading-[1.05] font-semibold text-background">
              {name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-[1.4] text-background/70">
              <span className="flex items-center gap-1">
                <Timer className="size-3.5" />
                {estimatedMinutes}min
              </span>

              <span className="flex items-center gap-1">
                <Dumbbell className="size-3.5" />
                {exercisesCount} exercicios
              </span>
            </div>
          </div>

          {action}
        </div>
      </div>
    </section>
  );
}
