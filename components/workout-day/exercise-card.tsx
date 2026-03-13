import { Zap } from "lucide-react";

import type { GetWorkoutDay200ExercisesItem } from "@/app/_lib/api/fetch-generated";
import { ExerciseChatButton } from "@/components/chat/exercise-chat-button";

type ExerciseCardProps = {
  exercise: GetWorkoutDay200ExercisesItem;
};

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <article className="rounded-xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-base leading-[1.4] font-semibold text-foreground">
            {exercise.name}
          </h2>

          <ExerciseChatButton exerciseName={exercise.name} />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="rounded-full bg-secondary px-2.5 py-1">
            <span className="font-heading text-xs leading-none font-semibold uppercase text-muted-foreground">
              {exercise.sets} series
            </span>
          </div>

          <div className="rounded-full bg-secondary px-2.5 py-1">
            <span className="font-heading text-xs leading-none font-semibold uppercase text-muted-foreground">
              {exercise.reps} reps
            </span>
          </div>

          <div className="flex h-[22px] items-center gap-1 rounded-full bg-secondary px-2.5 py-1">
            <Zap className="size-3.5 text-muted-foreground" />
            <span className="font-heading text-xs leading-none font-semibold uppercase text-muted-foreground">
              {exercise.restTimeInSeconds}S
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
