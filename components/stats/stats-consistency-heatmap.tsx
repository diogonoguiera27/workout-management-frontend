import dayjs, { type Dayjs } from "dayjs";

import type { GetStats200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";

type StatsConsistencyHeatmapProps = {
  consistencyByDay: GetStats200ConsistencyByDay;
  from: string;
  to: string;
};

type HeatmapMonthLabel = {
  key: string;
  label: string;
  weekCount: number;
};

type HeatmapWeek = {
  key: string;
  days: Dayjs[];
};

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;
const GRID_GAP = 4;
const MIN_CELL_SIZE = 8;
const MAX_CELL_SIZE = 20;

function getMonthLabel(monthIndex: number) {
  return MONTH_LABELS[monthIndex] ?? "";
}

function getStartOfIsoWeek(date: Dayjs) {
  const weekDay = date.day();
  const offset = weekDay === 0 ? 6 : weekDay - 1;

  return date.subtract(offset, "day").startOf("day");
}

function getEndOfIsoWeek(date: Dayjs) {
  return getStartOfIsoWeek(date).add(6, "day").endOf("day");
}

function buildHeatmapData(from: string, to: string) {
  const startMonth = dayjs(from).startOf("month");
  const endMonth = dayjs(to).startOf("month");
  const monthLabels: HeatmapMonthLabel[] = [];
  let currentMonth = startMonth;
  const calendarStart = getStartOfIsoWeek(startMonth);
  const calendarEnd = getEndOfIsoWeek(endMonth.endOf("month"));
  const weeks: HeatmapWeek[] = [];
  let currentWeek = calendarStart;

  while (currentWeek.isBefore(calendarEnd) || currentWeek.isSame(calendarEnd, "day")) {
    weeks.push({
      key: currentWeek.format("YYYY-MM-DD"),
      days: Array.from({ length: 7 }, (_, dayIndex) =>
        currentWeek.add(dayIndex, "day")
      ),
    });

    currentWeek = currentWeek.add(7, "day");
  }

  while (currentMonth.isBefore(endMonth) || currentMonth.isSame(endMonth, "month")) {
    const monthStart = currentMonth.startOf("month");
    const monthEnd = currentMonth.endOf("month");

    monthLabels.push({
      key: currentMonth.format("YYYY-MM"),
      label: getMonthLabel(currentMonth.month()),
      weekCount:
        getStartOfIsoWeek(monthEnd).diff(getStartOfIsoWeek(monthStart), "week") + 1,
    });

    currentMonth = currentMonth.add(1, "month");
  }

  return {
    monthLabels,
    weeks,
  };
}

function getCellState(date: Dayjs, consistencyByDay: GetStats200ConsistencyByDay) {
  const key = date.format("YYYY-MM-DD");
  const dayData = consistencyByDay[key];

  if (!dayData) {
    return "idle";
  }

  if (dayData.workoutDayCompleted) {
    return "completed";
  }

  if (dayData.workoutDayStarted) {
    return "started";
  }

  return "idle";
}

function getCellClassName(state: "completed" | "started" | "idle") {
  if (state === "completed") {
    return "border-primary bg-primary";
  }

  if (state === "started") {
    return "border-primary/20 bg-primary/20";
  }

  return "border-border bg-background";
}

export function StatsConsistencyHeatmap({
  consistencyByDay,
  from,
  to,
}: StatsConsistencyHeatmapProps) {
  const { monthLabels, weeks } = buildHeatmapData(from, to);
  const totalWeekColumns = weeks.length;
  const availableWidth = 313;
  const totalGapWidth = Math.max(0, totalWeekColumns - 1) * GRID_GAP;
  const rawCellSize = Math.floor(
    (availableWidth - totalGapWidth) / Math.max(totalWeekColumns, 1)
  );
  const cellSize = Math.max(MIN_CELL_SIZE, Math.min(MAX_CELL_SIZE, rawCellSize));

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-heading text-[18px] leading-[1.4] font-semibold text-foreground">
        Consistência
      </h2>

      <div className="overflow-hidden rounded-xl border border-border px-5 py-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start" style={{ gap: `${GRID_GAP}px` }}>
            {monthLabels.map((month) => (
              <div
                key={month.key}
                className="shrink-0"
                style={{
                  width: `${month.weekCount * cellSize + Math.max(0, month.weekCount - 1) * GRID_GAP}px`,
                }}
              >
                <p className="font-heading text-xs leading-[1.4] text-muted-foreground">
                  {month.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-start" style={{ gap: `${GRID_GAP}px` }}>
            {weeks.map((week) => (
              <div
                key={week.key}
                className="flex shrink-0 flex-col"
                style={{ gap: `${GRID_GAP}px` }}
              >
                {week.days.map((date) => {
                  const state = getCellState(date, consistencyByDay);

                  return (
                    <div
                      key={date.format("YYYY-MM-DD")}
                      className={`shrink-0 rounded-[4px] border ${getCellClassName(state)}`}
                      style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
