import type { GetHomeData200 } from "@/app/_lib/api/fetch-generated";

export function getWorkoutDayHref(workoutPlanId: string, workoutDayId: string) {
  return `/workout-plans/${workoutPlanId}/days/${workoutDayId}`;
}

export function getTodayWorkoutDayHref(homeData: GetHomeData200) {
  if (!homeData.activeWorkoutPlanId || !homeData.todayWorkoutDay?.id) {
    return null;
  }

  return getWorkoutDayHref(
    homeData.activeWorkoutPlanId,
    homeData.todayWorkoutDay.id,
  );
}
