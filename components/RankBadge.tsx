/** 名次徽章：前三名用金 / 银 / 铜配色，其余中性。服务端渲染，无客户端 JS。 */
const RANK_BADGE: Record<number, string> = {
  1: "bg-[#fbeecb] text-[#8a6512] ring-[#e0c07a]",
  2: "bg-[#e9edf3] text-[#55606e] ring-[#c3ccd8]",
  3: "bg-[#f6e3d5] text-[#8a5329] ring-[#ddb08c]",
};

const RANK_NAME: Record<number, string> = {
  1: "金牌",
  2: "银牌",
  3: "铜牌",
};

export default function RankBadge({
  rank,
  size = "md",
}: {
  rank: number;
  size?: "md" | "sm";
}) {
  const style = RANK_BADGE[rank] ?? "bg-canvas text-muted ring-line";
  const dims = size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm";
  const medal = RANK_NAME[rank];
  return (
    <span
      className={`grid ${dims} shrink-0 place-items-center rounded-full font-semibold tabular-nums ring-1 ${style}`}
      title={medal ? `第 ${rank} 名 · ${medal}` : `第 ${rank} 名`}
      aria-label={medal ? `第 ${rank} 名（${medal}）` : `第 ${rank} 名`}
    >
      {rank}
    </span>
  );
}
