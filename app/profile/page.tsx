import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/app/_lib/auth-client";
import { getOnboardingState } from "@/app/_lib/get-onboarding-state";
import { HomeToolbar } from "@/components/home/bottom-nav";
import { ProfileLogoutButton } from "@/components/profile/profile-logout-button";
import { ProfileMetricCard } from "@/components/profile/profile-metric-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function formatWeightInKilograms(weightInGrams: number) {
  return (weightInGrams / 1000).toFixed(1);
}

export default async function ProfilePage() {
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

  const userTrainDataResponse = onboardingState.userTrainDataResponse;

  if (userTrainDataResponse.status !== 200) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-5">
        <p className="text-sm text-muted-foreground">
          Nao foi possivel carregar o perfil.
        </p>
      </main>
    );
  }

  const user = session.data.user;
  const userTrainData = userTrainDataResponse.data;
  const fallbackName = userTrainData?.userName?.trim() || user.name?.trim() || "Aluno";
  const nameInitials = fallbackName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <main className="flex min-h-svh justify-center bg-background">
      <section className="relative flex min-h-svh w-full max-w-[393px] flex-col bg-background pb-[88px]">
        <header className="flex items-center px-5 py-5">
          <p className="font-anton text-[22px] leading-[1.15] text-foreground uppercase">
            Fit.ai
          </p>
        </header>

        <section className="flex flex-col gap-5 px-5 py-5">
          <div className="flex items-center gap-3">
            <Avatar className="size-[52px]">
              <AvatarImage src={user.image || "/profile/profile-avatar-reference.png"} />
              <AvatarFallback>{nameInitials}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1.5">
              <p className="font-heading text-[18px] leading-[1.05] font-semibold text-foreground">
                {fallbackName}
              </p>
              <p className="font-heading text-sm leading-[1.15] text-foreground/70">
                Plano Basico
              </p>
            </div>
          </div>

          <section className="grid grid-cols-2 gap-3">
            <ProfileMetricCard
              iconAlt="Peso"
              iconSrc="/profile/profile-icon-weight.svg"
              label="KG"
              value={
                userTrainData ? formatWeightInKilograms(userTrainData.weightInGrams) : "-"
              }
            />
            <ProfileMetricCard
              iconAlt="Altura"
              iconSrc="/profile/profile-icon-height.svg"
              label="CM"
              value={userTrainData ? String(userTrainData.heightInCentimeters) : "-"}
            />
            <ProfileMetricCard
              iconAlt="Gordura corporal"
              iconSrc="/profile/profile-icon-fat.svg"
              label="GC"
              value={userTrainData ? `${userTrainData.bodyFatPercentage}%` : "-"}
            />
            <ProfileMetricCard
              iconAlt="Idade"
              iconSrc="/profile/profile-icon-age.svg"
              label="ANOS"
              value={userTrainData ? String(userTrainData.age) : "-"}
            />
          </section>

          <div className="flex justify-center pt-1">
            <ProfileLogoutButton />
          </div>
        </section>

        <div className="absolute inset-x-0 bottom-0">
          <HomeToolbar activePage="profile" />
        </div>
      </section>
    </main>
  );
}
