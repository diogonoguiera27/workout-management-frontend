import { Calendar, Dumbbell, Timer, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { GetWorkoutPlan200WorkoutDaysItem } from "@/app/_lib/api/fetch-generated";
import { Badge } from "@/components/ui/badge";
import { getWorkoutDayHref } from "@/lib/workout-paths";

type WorkoutPlanDayCardProps = {
  workoutDay: GetWorkoutPlan200WorkoutDaysItem;
  workoutPlanId: string;
};

const WEEK_DAY_LABELS: Record<GetWorkoutPlan200WorkoutDaysItem["weekDay"], string> = {
  SUNDAY: "DOMINGO",
  MONDAY: "SEGUNDA",
  TUESDAY: "TERCA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SABADO",
};

export function WorkoutPlanDayCard({
  workoutDay,
  workoutPlanId,
}: WorkoutPlanDayCardProps) {
  const href = getWorkoutDayHref(workoutPlanId, workoutDay.id);
  const estimatedMinutes = Math.floor(workoutDay.estimatedDurationInSeconds / 60);

  if (workoutDay.isRest) {
    return (
      <Link
        href={href}
        className="flex h-[110px] flex-col justify-between overflow-hidden rounded-xl bg-muted p-5"
      >
        <div className="flex h-6 w-fit items-center gap-1 rounded-full bg-foreground/8 px-2.5 py-[5px] text-foreground">
          <Calendar className="size-3.5" />
          <span className="font-heading text-xs leading-none font-semibold tracking-normal">
            {WEEK_DAY_LABELS[workoutDay.weekDay]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Zap className="size-5 text-primary" />
          <p className="font-heading text-2xl leading-[1.05] font-semibold text-foreground">
            Descanso
          </p>
        </div>
      </Link>
    );
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
        <Badge className="h-6 w-fit rounded-full bg-background/16 px-2.5 py-[5px] text-background backdrop-blur-[8px] hover:bg-background/16">
          <Calendar className="size-3.5" />
          <span className="font-heading text-xs leading-none font-semibold tracking-normal">
            {WEEK_DAY_LABELS[workoutDay.weekDay]}
          </span>
        </Badge>

        <div className="flex flex-col gap-2">
          <p className="font-heading text-2xl leading-[1.05] font-semibold text-background">
            {workoutDay.name}
          </p>

          <div className="flex items-center gap-2 text-background/70">
            <span className="flex items-center gap-1">
              <Timer className="size-3.5" />
              <span className="font-heading text-xs leading-[1.4] font-normal">
                {estimatedMinutes}min
              </span>
            </span>

            <span className="flex items-center gap-1">
              <Dumbbell className="size-3.5" />
              <span className="font-heading text-xs leading-[1.4] font-normal">
                {workoutDay.exercisesCount} exercicios
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
