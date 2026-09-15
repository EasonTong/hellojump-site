import Link from "next/link";
import { LEADERBOARD_LIMIT, getLeaderboard } from "@/lib/data";
import { toLeaderboardItems } from "@/lib/view";
import { isSupabaseConfigured } from "@/lib/supabase";
import LeaderboardList from "@/components/LeaderboardList";
import EmptyState from "@/components/EmptyState";

export const metadata = {
  title: "全球榜",
  description:
    "HelloJump 抛手机测高全球榜：每人最好成绩、昵称、机型、滞空时间与高度。",
};

// 静态导出：没有 ISR，数据在构建时固化，靠 GitHub Action 的定时构建刷新。
// 取不到数据也照样出页面 —— data 层返回空数组，页面走空状态。

export default async function LeaderboardPage() {
  const items = toLeaderboardItems(
    await getLeaderboard(LEADERBOARD_LIMIT),
    Date.now(),
  );
  const top = items[0];

  return (
    <div className="shell py-14 md:py-20">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-brand">全球榜</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          抛手机测高 · 全球排行
        </h1>
        <p className="mt-4 leading-relaxed text-muted">
          同一台设备只保留最好的一次成绩，按高度降序排列。
          昵称与机型由 App 端上报，高度是前端按 h = g·Δt²/8 换算后保留两位小数的结果。
        </p>
      </header>

      {items.length > 0 ? (
        <>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <dt className="text-xs text-muted">上榜玩家</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">
                {items.length}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">榜首高度</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums text-brand">
                {top?.height}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">榜首滞空</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">
                {top?.airTime}
              </dd>
            </div>
          </dl>

          <div className="mt-10">
            <LeaderboardList items={items} />
          </div>

          <p className="mt-6 text-xs leading-relaxed text-muted">
            数据来自 Supabase 项目的 <code className="font-mono">jump.leaderboard_top</code>{" "}
            视图，每 60 秒自动刷新一次。名次仅记录各设备的历史最好成绩。
          </p>
        </>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="暂时没有榜单数据"
            description={
              isSupabaseConfigured
                ? "云端榜单还没有成绩，或者这一次没能连上后端。等 App 端上传第一条成绩后，这里就会出现名次。稍后刷新页面再试。"
                : "站点还没有配置 Supabase 环境变量（NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY），因此读不到榜单数据。请检查部署环境变量。"
            }
            action={
              <Link href="/" className="btn-secondary mt-2">
                回到首页
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
}
