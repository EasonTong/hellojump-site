import Link from "next/link";
import { getAnnouncements } from "@/lib/data";
import { toAnnouncementItems } from "@/lib/view";
import { isSupabaseConfigured } from "@/lib/supabase";
import AnnouncementList from "@/components/AnnouncementList";
import EmptyState from "@/components/EmptyState";

export const metadata = {
  title: "公告与更新日志",
  description: "HelloJump 抛手机测高的公告、版本更新与活动信息。",
};

/** 公告要改完尽快生效，60 秒足够 */
export const revalidate = 60;

export default async function AnnouncementsPage() {
  const items = toAnnouncementItems(await getAnnouncements());

  return (
    <div className="shell py-14 md:py-20">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-brand">公告</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          公告与更新日志
        </h1>
        <p className="mt-4 leading-relaxed text-muted">
          这里显示当前已发布、且仍在生效时间窗口内的公告。
          点击任意一条可以展开阅读完整正文。
        </p>
      </header>

      <div className="mt-10">
        {items.length > 0 ? (
          <>
            <AnnouncementList items={items} />
            <p className="mt-6 text-xs leading-relaxed text-muted">
              数据来自 <code className="font-mono">jump.active_announcement</code>{" "}
              视图（已发布且在生效期内），按「置顶优先、发布时间倒序」排列。
            </p>
          </>
        ) : (
          <EmptyState
            icon="bell"
            title="暂时还没有公告"
            description={
              isSupabaseConfigured
                ? "目前没有已发布且在有效期内的公告 —— 也可能是刚才没连上后端。 有新的版本更新或活动时，会第一时间出现在这里。"
                : "站点还没有配置 Supabase 环境变量，因此读不到公告数据。请检查部署环境变量。"
            }
            action={
              <Link href="/leaderboard" className="btn-secondary mt-2">
                先去看看全球榜
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
