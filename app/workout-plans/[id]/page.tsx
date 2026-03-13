import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { getWorkoutPlan } from "@/app/_lib/api/fetch-generated";
import { authClient } from "@/app/_lib/auth-client";
import { getOnboardingState } from "@/app/_lib/get-onboarding-state";
import { HomeToolbar } from "@/components/home/bottom-nav";
import { WorkoutPlanDayCard } from "@/components/workout-plan/workout-plan-day-card";
import { WorkoutPlanHeader } from "@/components/workout-plan/workout-plan-header";

type WorkoutPlanPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WorkoutPlanPage({
  params,
}: WorkoutPlanPageProps) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) {
    redirect("/auth");
  }

  const onboardingState = await getOnboardingState();

  if (onboardingState.homeDataResponse.status === 401) {
    redirect("/auth");
  }

  if (onboardingState.userTrainDataResponse.status === 401) {
    redirect("/auth");
  }

  if (onboardingState.requiresOnboarding) {
    redirect("/onboarding");
  }

  const { id } = await params;
  const workoutPlanResponse = await getWorkoutPlan(id);

  if (workoutPlanResponse.status === 401) {
    redirect("/auth");
  }

  if (workoutPlanResponse.status === 404) {
    notFound();
  }

  if (workoutPlanResponse.status !== 200) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-5">
        <p className="text-sm text-muted-foreground">
          Nao foi possivel carregar os dados do plano de treino.
        </p>
      </main>
    );
  }

  const workoutPlan = workoutPlanResponse.data;

  return (
    <main className="flex min-h-svh justify-center bg-background">
      <section className="relative flex min-h-svh w-full max-w-[393px] flex-col bg-background pb-[88px]">
        <WorkoutPlanHeader workoutPlanName={workoutPlan.name} />

        <section className="flex flex-col gap-3 px-5 pt-5 pb-5">
          {workoutPlan.workoutDays.map((workoutDay) => (
            <WorkoutPlanDayCard
              key={workoutDay.id}
              workoutDay={workoutDay}
              workoutPlanId={workoutPlan.id}
            />
          ))}
        </section>

        <div className="absolute inset-x-0 bottom-0">
          <HomeToolbar activePage="calendar" />
        </div>
      </section>
    </main>
  );
}
