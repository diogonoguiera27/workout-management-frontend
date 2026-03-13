import Link from "next/link";
import {
  House,
  Calendar,
  ChartNoAxesColumn,
  UserRound,
} from "lucide-react";
import dayjs from "dayjs";
import { getHomeData } from "@/app/_lib/api/fetch-generated";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChatOpenButton } from "./chat-open-button";

interface BottomNavProps {
  activePage?: "home" | "calendar" | "stats" | "profile";
}

export async function HomeToolbar({ activePage = "home" }: BottomNavProps) {
  const today = dayjs();
  const homeData = await getHomeData(today.format("YYYY-MM-DD"));

  const calendarHref =
    homeData.status === 200
      ? homeData.data.activeWorkoutPlanId
        ? `/workout-plans/${homeData.data.activeWorkoutPlanId}`
        : null
      : null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-6 rounded-t-[20px] border border-border bg-background px-6 py-4">
      <Link href="/" className="p-3">
        <House
          className={cn(
            "size-6",
            activePage === "home" ? "text-foreground" : "text-muted-foreground"
          )}
        />
      </Link>
      {calendarHref ? (
        <Button asChild variant="ghost" size="icon-sm" className="rounded-full">
          <Link href={calendarHref}>
            <Calendar
              className={cn(
                "size-6",
                activePage === "calendar"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            />
          </Link>
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          disabled
        >
          <Calendar
            className={cn(
              "size-6",
              activePage === "calendar"
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          />
        </Button>
      )}
      <ChatOpenButton />
      <Link href="/stats" className="p-3">
        <ChartNoAxesColumn
          className={cn(
            "size-6",
            activePage === "stats"
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        />
      </Link>
      <Link href="/profile" className="p-3">
        <UserRound
          className={cn(
            "size-6",
            activePage === "profile"
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        />
      </Link>
    </nav>
  );
}
