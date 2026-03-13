import dayjs from "dayjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getStats } from "@/app/_lib/api/fetch-generated";
import { authClient } from "@/app/_lib/auth-client";
import { getOnboardingState } from "@/app/_lib/get-onboarding-state";
import { HomeToolbar } from "@/components/home/bottom-nav";
import { StatsConsistencyHeatmap } from "@/components/stats/stats-consistency-heatmap";
import { StatsMetricCard } from "@/components/stats/stats-metric-card";
import { StatsStreakBanner } from "@/components/stats/stats-streak-banner";

function formatTotalTime(totalTimeInSeconds: number) {
  const totalMinutes = Math.max(0, Math.round(totalTimeInSeconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h${minutes}m`;
}

export default async function StatsPage() {
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

  const from = dayjs().startOf("month").subtract(2, "month").format("YYYY-MM-DD");
  const to = dayjs().endOf("month").format("YYYY-MM-DD");
  const statsResponse = await getStats({ from, to });

  if (statsResponse.status === 401) {
    redirect("/auth");
  }

  if (statsResponse.status !== 200) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-5">
        <p className="text-sm text-muted-foreground">
          Nao foi possivel carregar as estatisticas.
        </p>
      </main>
    );
  }

  const stats = statsResponse.data;

  return (
    <main className="flex min-h-svh justify-center bg-background">
      <section className="relative flex min-h-svh w-full max-w-[393px] flex-col bg-background pb-[88px]">
        <header className="flex items-center px-5 py-5">
          <p className="font-anton text-[22px] leading-[1.15] text-foreground uppercase">
            Fit.ai
          </p>
        </header>

        <section className="px-5">
          <StatsStreakBanner streak={stats.workoutStreak} />
        </section>

        <section className="flex flex-col gap-3 px-5 py-5">
          <StatsConsistencyHeatmap
            consistencyByDay={stats.consistencyByDay}
            from={from}
            to={to}
          />

          <section className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <StatsMetricCard
                iconAlt="Treinos feitos"
                iconSrc="/stats/card-icon-completed.svg"
                iconSize={16}
                label="Treinos Feitos"
                value={String(stats.completedWorkoutsCount)}
              />
              <StatsMetricCard
                iconAlt="Taxa de conclusão"
                iconSrc="/stats/card-icon-rate.svg"
                iconSize={16}
                label="Taxa de conclusão"
                value={`${Math.round(stats.conclusionRate * 100)}%`}
              />
            </div>

            <StatsMetricCard
              iconAlt="Tempo total"
              iconSrc="/stats/card-icon-time.svg"
              iconSize={34}
              label="Tempo Total"
              value={formatTotalTime(stats.totalTimeInSeconds)}
            />
          </section>
        </section>

        <div className="absolute inset-x-0 bottom-0">
          <HomeToolbar activePage="stats" />
        </div>
      </section>
    </main>
  );
}
