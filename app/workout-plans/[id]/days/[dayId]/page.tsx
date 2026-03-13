import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import {
  type GetWorkoutDay200,
  getWorkoutDay,
} from "@/app/_lib/api/fetch-generated";
import { authClient } from "@/app/_lib/auth-client";
import { getOnboardingState } from "@/app/_lib/get-onboarding-state";
import {
  completeWorkoutDaySessionAction,
  startWorkoutDaySessionAction,
} from "@/app/workout-plans/[id]/days/[dayId]/actions";
import { HomeToolbar } from "@/components/home/bottom-nav";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/workout-day/exercise-card";
import { WorkoutDayBackButton } from "@/components/workout-day/workout-day-back-button";
import { WorkoutDayHeroCard } from "@/components/workout-day/workout-day-hero-card";

type WorkoutDayPageProps = {
  params: Promise<{
    id: string;
    dayId: string;
  }>;
};

const WEEK_DAY_LABELS: Record<GetWorkoutDay200["weekDay"], string> = {
  SUNDAY: "DOMINGO",
  MONDAY: "SEGUNDA",
  TUESDAY: "TERCA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SABADO",
};

const WEEK_DAY_TITLES: Record<GetWorkoutDay200["weekDay"], string> = {
  SUNDAY: "Domingo",
  MONDAY: "Segunda",
  TUESDAY: "Terca",
  WEDNESDAY: "Quarta",
  THURSDAY: "Quinta",
  FRIDAY: "Sexta",
  SATURDAY: "Sabado",
};

function getWorkoutSessionState(sessions: GetWorkoutDay200["sessions"]) {
  const inProgressSession = sessions.find(
    (session) => session.startedAt && !session.completedAt,
  );

  if (inProgressSession) {
    return {
      state: "in-progress" as const,
      sessionId: inProgressSession.id,
    };
  }

  const hasCompletedSession = sessions.some((session) => !!session.completedAt);

  if (hasCompletedSession) {
    return {
      state: "completed" as const,
      sessionId: null,
    };
  }

  return {
    state: "idle" as const,
    sessionId: null,
  };
}

export default async function WorkoutDayPage({
  params,
}: WorkoutDayPageProps) {
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

  const { id, dayId } = await params;
  const workoutDayResponse = await getWorkoutDay(id, dayId);

  if (workoutDayResponse.status === 401) {
    redirect("/auth");
  }

  if (workoutDayResponse.status === 404) {
    notFound();
  }

  if (workoutDayResponse.status !== 200) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-5">
        <p className="text-sm text-muted-foreground">
          Nao foi possivel carregar os dados do treino.
        </p>
      </main>
    );
  }

  const workoutDay = workoutDayResponse.data;
  const workoutSessionState = getWorkoutSessionState(workoutDay.sessions);
  const startWorkoutAction = startWorkoutDaySessionAction.bind(null, id, dayId);
  const completeWorkoutAction =
    workoutSessionState.sessionId === null
      ? null
      : completeWorkoutDaySessionAction.bind(
          null,
          id,
          dayId,
          workoutSessionState.sessionId,
        );

  const heroAction =
    workoutSessionState.state === "idle" ? (
      <form action={startWorkoutAction}>
        <Button
          type="submit"
          className="h-8 rounded-full bg-primary px-4 text-sm leading-none font-semibold text-primary-foreground hover:bg-primary"
        >
          Iniciar Treino
        </Button>
      </form>
    ) : workoutSessionState.state === "completed" ? (
      <Button
        type="button"
        variant="ghost"
        disabled
        className="h-8 rounded-full bg-background/20 px-4 text-sm leading-none font-semibold text-background opacity-100 hover:bg-background/20 hover:text-background"
      >
        Concluido!
      </Button>
    ) : null;

  return (
    <main className="flex min-h-svh justify-center bg-background">
      <section className="relative flex min-h-svh w-full max-w-[390px] flex-col bg-background px-5 pt-5 pb-[108px]">
        <header className="flex items-center justify-between gap-3">
          <WorkoutDayBackButton />
          <p className="font-heading text-[18px] leading-[1.4] font-semibold text-foreground">
            {WEEK_DAY_TITLES[workoutDay.weekDay]}
          </p>
          <div className="size-6" />
        </header>

        <div className="flex flex-col gap-5 pt-5">
          <WorkoutDayHeroCard
            name={workoutDay.name}
            coverImageUrl={workoutDay.coverImageUrl}
            weekDayLabel={WEEK_DAY_LABELS[workoutDay.weekDay]}
            estimatedDurationInSeconds={workoutDay.estimatedDurationInSeconds}
            exercisesCount={workoutDay.exercises.length}
            action={heroAction}
          />

          <div className="flex flex-col gap-3">
            {workoutDay.exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>

          {workoutSessionState.state === "in-progress" && completeWorkoutAction ? (
            <form action={completeWorkoutAction}>
              <Button
                type="submit"
                variant="outline"
                className="h-11 w-full rounded-full border-border bg-background font-heading text-sm font-semibold text-foreground hover:bg-background"
              >
                Marcar como concluido
              </Button>
            </form>
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <HomeToolbar activePage="calendar" />
        </div>
      </section>
    </main>
  );
}
