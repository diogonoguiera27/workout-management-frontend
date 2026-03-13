import Image from "next/image";
import Link from "next/link";
import { Calendar, Dumbbell, Timer } from "lucide-react";

import type { GetHomeData200TodayWorkoutDay } from "@/app/_lib/api/fetch-generated";

type TodayWorkoutDayProps = {
  href?: string | null;
  workoutDay?: GetHomeData200TodayWorkoutDay | null;
};

const WEEK_DAY_LABELS: Record<GetHomeData200TodayWorkoutDay["weekDay"], string> = {
  SUNDAY: "DOMINGO",
  MONDAY: "SEGUNDA",
  TUESDAY: "TERCA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SABADO",
};

export function TodayWorkoutDay({ href, workoutDay }: TodayWorkoutDayProps) {
  if (!workoutDay) {
    if (!href) {
      return (
        <div className="relative block h-[200px] overflow-hidden rounded-xl">
          <Image
            src="/home/today-workout-background.png"
            alt="Sem treino para hoje"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-foreground/80" />

          <div className="relative flex h-full flex-col justify-end p-5">
            <h2 className="font-heading text-2xl leading-[1.05] font-semibold text-background">
              Sem treino para hoje
            </h2>
          </div>
        </div>
      );
    }

    return (
      <Link href={href} className="relative block h-[200px] overflow-hidden rounded-xl">
        <Image
          src="/home/today-workout-background.png"
          alt="Sem treino para hoje"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-foreground/80" />

        <div className="relative flex h-full flex-col justify-end p-5">
          <h2 className="font-heading text-2xl leading-[1.05] font-semibold text-background">
            Sem treino para hoje
          </h2>
        </div>
      </Link>
    );
  }

  const estimatedMinutes = Math.floor(workoutDay.estimatedDurationInSeconds / 60);

  if (!href) {
    return null;
  }

  return (
    <Link href={href} className="relative block h-[200px] overflow-hidden rounded-xl">
      <Image
        src={workoutDay.coverImageUrl || "/home/today-workout-background.png"}
        alt={workoutDay.name}
        fill
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-foreground/80" />

      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="inline-flex w-fit items-center gap-1 rounded-full bg-background/20 px-2.5 py-1.5 backdrop-blur-lg">
          <Calendar className="size-3.5 text-background" />
          <span className="font-heading text-xs leading-none font-semibold tracking-[0.04em] text-background">
            {WEEK_DAY_LABELS[workoutDay.weekDay]}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-2xl leading-[1.05] font-semibold text-background">
            {workoutDay.name}
          </h2>

          <div className="flex items-center gap-2 text-xs leading-[1.4] text-background/70">
            <span className="flex items-center gap-1">
              <Timer className="size-3.5" />
              {estimatedMinutes}min
            </span>

            <span className="flex items-center gap-1">
              <Dumbbell className="size-3.5" />
              {workoutDay.exercisesCount} exercicios
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
