"use server";

import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

import {
  patchWorkoutPlansWorkoutPlanIdDaysWorkoutDayIdSessionsSessionId,
  startWorkoutSession,
} from "@/app/_lib/api/fetch-generated";

import { getWorkoutDayHref } from "@/lib/workout-paths";

export async function startWorkoutDaySessionAction(
  workoutPlanId: string,
  workoutDayId: string,
) {
  const response = await startWorkoutSession(workoutPlanId, workoutDayId);

  if (response.status !== 201 && response.status !== 409) {
    throw new Error(response.data.error || "Nao foi possivel iniciar o treino.");
  }

  revalidatePath(getWorkoutDayHref(workoutPlanId, workoutDayId));
}

export async function completeWorkoutDaySessionAction(
  workoutPlanId: string,
  workoutDayId: string,
  sessionId: string,
) {
  const response = await patchWorkoutPlansWorkoutPlanIdDaysWorkoutDayIdSessionsSessionId(
    workoutPlanId,
    workoutDayId,
    sessionId,
    {
      completedAt: dayjs().toDate().toISOString(),
    },
  );

  if (response.status !== 200) {
    throw new Error(response.data.error || "Nao foi possivel concluir o treino.");
  }

  revalidatePath(getWorkoutDayHref(workoutPlanId, workoutDayId));
}
