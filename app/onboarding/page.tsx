import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/app/_lib/auth-client";
import { getOnboardingState } from "@/app/_lib/get-onboarding-state";
import { Chat } from "@/components/home/chat";

export default async function OnboardingPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");
  

  const onboardingState = await getOnboardingState();

  if (onboardingState.homeDataResponse.status === 401) {
    redirect("/auth");
  }

  if (onboardingState.userTrainDataResponse.status === 401) {
    redirect("/auth");
  }

  if (!onboardingState.requiresOnboarding) {
    redirect("/");
  }

  return (
    <main className="flex min-h-svh justify-center bg-background">
      <section className="flex min-h-svh w-full max-w-[393px] flex-col bg-background px-4 py-4">
        <div className="flex flex-1">
          <Chat mode="onboarding" />
        </div>
      </section>
    </main>
  );
}
