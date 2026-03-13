import dayjs from "dayjs";

import {
  getHomeData,
  getUserTrainData,
} from "@/app/_lib/api/fetch-generated";

export async function getOnboardingState() {
  const [homeDataResponse, userTrainDataResponse] = await Promise.all([
    getHomeData(dayjs().format("YYYY-MM-DD")),
    getUserTrainData(),
  ]);

  const hasActiveWorkoutPlan =
    homeDataResponse.status === 200 && !!homeDataResponse.data.activeWorkoutPlanId;
  const hasUserTrainData =
    userTrainDataResponse.status === 200 && userTrainDataResponse.data !== null;
  const requiresOnboarding = !hasActiveWorkoutPlan || !hasUserTrainData;

  return {
    homeDataResponse,
    userTrainDataResponse,
    requiresOnboarding,
  };
}
