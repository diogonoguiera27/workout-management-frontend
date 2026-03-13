import Image from "next/image";

type ProfileMetricCardProps = {
  iconAlt: string;
  iconSrc: string;
  label: string;
  value: string;
};

export function ProfileMetricCard({
  iconAlt,
  iconSrc,
  label,
  value,
}: ProfileMetricCardProps) {
  return (
    <article className="flex flex-col items-center gap-5 rounded-xl bg-stats-surface px-5 py-5">
      <Image src={iconSrc} alt={iconAlt} width={34} height={34} />

      <div className="flex flex-col items-center gap-1.5">
        <p className="font-heading text-2xl leading-[1.15] font-semibold tracking-[-0.04em] text-foreground">
          {value}
        </p>
        <p className="font-heading text-xs leading-[1.4] uppercase text-muted-foreground">
          {label}
        </p>
      </div>
    </article>
  );
}
