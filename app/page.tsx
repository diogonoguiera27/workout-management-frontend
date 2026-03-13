import { Flame } from "lucide-react";
import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/app/_lib/auth-client";
import { getOnboardingState } from "@/app/_lib/get-onboarding-state";

import { Button } from "@/components/ui/button";
import { TodayWorkoutDay } from "@/components/home/workout-day-card";
import { HomeToolbar } from "@/components/home/bottom-nav";
import { ConsistencyTracker } from "@/components/home/consistency-tracker";
import { getTodayWorkoutDayHref } from "@/lib/workout-paths";

export default async function Home() {
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

  const homeDataResponse = onboardingState.homeDataResponse;

  if (homeDataResponse.status !== 200) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-5">
        <p className="text-sm text-muted-foreground">
          Nao foi possivel carregar os dados da home.
        </p>
      </main>
    );
  }

  const homeData = homeDataResponse.data;
  const consistencyByDay = homeData?.consistencyByDay || {};
  const firstName = session.data.user.name?.split(" ")[0] || "Aluno";
  const todayWorkoutHref = getTodayWorkoutDayHref(homeData);

  return (
    <main className="flex min-h-svh justify-center bg-background">
      <section className="relative flex min-h-svh w-full max-w-[393px] flex-col bg-background pb-[88px]">
        <header className="relative flex h-[296px] flex-col justify-between overflow-hidden rounded-b-[20px] px-5 pt-5 pb-10">
          <Image
            src="/home/banner-background.png"
            alt="Banner de treino"
            fill
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-bl from-transparent from-[32%] to-foreground to-[100%]" />

          <p className="relative font-anton text-[22px] leading-[1.15] text-background uppercase">
            Fit.ai
          </p>

          <div className="relative flex items-end justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <p className="font-heading text-2xl leading-[1.05] font-semibold text-background">
                Ola, {firstName}
              </p>
              <p className="font-heading text-sm leading-[1.15] text-background/70">
                Bora treinar hoje?
              </p>
            </div>

            <Button
              type="button"
              className="h-8 rounded-full bg-primary px-4 text-sm leading-none font-semibold text-primary-foreground hover:bg-primary"
            >
              Bora!
            </Button>
          </div>
        </header>

        <section className="flex flex-col gap-3 px-5 pt-5">
          <div className="flex items-center justify-between gap-3">
            <h1 className="font-heading text-[18px] leading-[1.4] font-semibold text-foreground">
              Consistencia
            </h1>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 font-heading text-xs leading-[1.4] font-normal text-primary"
            >
              Ver historico
            </Button>
          </div>

          <div className="flex items-stretch gap-3">
            <ConsistencyTracker consistencyByDay={consistencyByDay} />

            <div className="flex items-center gap-2 self-stretch rounded-xl bg-streak px-5 py-2">
              <Flame className="size-5 text-streak-foreground" />
              <p className="font-heading text-base leading-[1.15] font-semibold text-streak-foreground">
                {homeData.workoutStreak || 0}
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3 px-5 pt-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-[18px] leading-[1.4] font-semibold text-foreground">
              Treino de Hoje
            </h2>

            <Button
              type="button"
              variant="link"
              className="h-auto p-0 font-heading text-xs leading-[1.4] font-normal text-primary"
            >
              Ver treinos
            </Button>
          </div>

          <TodayWorkoutDay href={todayWorkoutHref} workoutDay={homeData.todayWorkoutDay} />
        </section>

        <div className="absolute inset-x-0 bottom-0">
          <HomeToolbar />
        </div>
      </section>
    </main>
  );
}
