import dayjs from "dayjs";

import type { GetHomeData200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";
import { ConsistencySquare, type ConsistencyState } from "@/components/home/consistency-square";

const WEEK_LABELS = ["S", "T", "Q", "Q", "S", "S", "D"] as const;

const WEEK_DAY_TO_INDEX: Record<string, number> = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
};

const DAYJS_TO_INDEX: Record<number, number> = {
  0: 6,
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};

type ConsistencyTrackerProps = {
  consistencyByDay: GetHomeData200ConsistencyByDay | undefined;
};

export function ConsistencyTracker({ consistencyByDay }: ConsistencyTrackerProps) {
  const states: ConsistencyState[] = [
    "idle",
    "idle",
    "idle",
    "idle",
    "idle",
    "idle",
    "idle",
  ];

  Object.entries(consistencyByDay || {}).forEach(([key, value]) => {
    const enumIndex = WEEK_DAY_TO_INDEX[key];

    const dateIndex = dayjs(key).isValid() ? DAYJS_TO_INDEX[dayjs(key).day()] : undefined;

    const resolvedIndex = enumIndex ?? dateIndex;

    if (resolvedIndex === undefined) {
      return;
    }

    const nextState: ConsistencyState = value.workoutDayCompleted
      ? "completed"
      : value.workoutDayStarted
        ? "started"
        : "idle";

    const currentState = states[resolvedIndex];

    if (currentState === "completed") {
      return;
    }

    if (currentState === "started" && nextState === "idle") {
      return;
    }

    states[resolvedIndex] = nextState;
  });

  return (
    <div className="flex flex-1 items-center justify-between rounded-xl border border-border px-5 py-5">
      {WEEK_LABELS.map((label, index) => (
        <ConsistencySquare key={`${label}-${index}`} label={label} state={states[index]} />
      ))}
    </div>
  );
}
