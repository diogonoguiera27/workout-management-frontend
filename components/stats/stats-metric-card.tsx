import Image from "next/image";

type StatsMetricCardProps = {
  iconAlt: string;
  iconSrc: string;
  iconSize: 16 | 34;
  label: string;
  value: string;
  className?: string;
};

export function StatsMetricCard({
  iconAlt,
  iconSrc,
  iconSize,
  label,
  value,
  className,
}: StatsMetricCardProps) {
  return (
    <article
      className={`flex flex-col items-center gap-5 rounded-xl bg-stats-surface px-5 py-5 ${className ?? ""}`}
    >
      {iconSize === 34 ? (
        <Image src={iconSrc} alt={iconAlt} width={34} height={34} />
      ) : (
        <div className="flex w-[34px] items-center justify-center px-[9px] py-[9px]">
          <Image src={iconSrc} alt={iconAlt} width={16} height={16} />
        </div>
      )}

      <div className="flex flex-col items-center gap-1.5">
        <p className="font-heading text-2xl leading-[1.15] font-semibold tracking-[-0.04em] text-foreground">
          {value}
        </p>
        <p className="font-heading text-xs leading-[1.4] text-muted-foreground">
          {label}
        </p>
      </div>
    </article>
  );
}
