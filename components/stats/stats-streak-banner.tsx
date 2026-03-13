import Image from "next/image";

type StatsStreakBannerProps = {
  streak: number;
};

const ACTIVE_BANNER_BACKGROUND =
  "linear-gradient(128deg, #FFAE17 0%, #F98B26 28%, #A90200 68%, #6C0000 100%)";
const IDLE_BANNER_BACKGROUND =
  "linear-gradient(128deg, #B8B8B8 0%, #6A6A6A 24%, #26282D 62%, #0E1015 100%)";

export function StatsStreakBanner({ streak }: StatsStreakBannerProps) {
  const isActive = streak > 0;

  return (
    <section
      className="relative overflow-hidden rounded-xl"
      style={{
        backgroundImage: isActive
          ? `${ACTIVE_BANNER_BACKGROUND}, radial-gradient(circle at 16% 86%, rgba(241, 97, 0, 0.48), transparent 44%)`
          : `${IDLE_BANNER_BACKGROUND}, radial-gradient(circle at 16% 18%, rgba(255, 255, 255, 0.12), transparent 34%), radial-gradient(circle at 82% 34%, rgba(0, 0, 0, 0.18), transparent 44%)`,
      }}
    >
      <div className="relative flex flex-col items-center gap-3 px-5 py-10">
        <Image
          src={isActive ? "/stats/banner-flame-active.svg" : "/stats/banner-flame-idle.svg"}
          alt="Ícone de sequência"
          width={56}
          height={56}
        />

        <div className="flex flex-col items-center gap-1 text-background">
          <p className="font-heading text-5xl leading-[0.95] font-semibold tracking-[-0.04em]">
            {streak} dias
          </p>
          <p className="font-heading text-base leading-[1.15] text-background/60">
            Sequência Atual
          </p>
        </div>
      </div>
    </section>
  );
}
