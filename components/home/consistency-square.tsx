import { cn } from "@/lib/utils";

export type ConsistencyState = "completed" | "started" | "idle";

type ConsistencySquareProps = {
  label: string;
  state: ConsistencyState;
};

export function ConsistencySquare({ label, state }: ConsistencySquareProps) {
  const dayBoxClassName =
    state === "completed"
      ? "border-primary bg-primary"
      : state === "started"
        ? "border-primary/20 bg-primary/20"
        : "border-border bg-background";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={cn("size-5 rounded-md border", dayBoxClassName)} />
      <span className="font-heading text-xs leading-[1.4] text-muted-foreground">{label}</span>
    </div>
  );
}
