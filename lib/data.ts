import { supabase } from "./supabase";

/**
 * 数据访问层。
 *
 * 只读两个视图：
 *   - jump.leaderboard_top    每人最好成绩（已按 height_m 降序）
 *   - jump.active_announcement 已发布且在时间窗口内的公告
 *
 * 所有函数都 **不会抛异常**：拿不到数据（断网 / 未配置 / 视图为空 / RLS 拒绝）
 * 统一返回空数组，由页面渲染空状态。这样 `next build` 在离线环境下也能通过。
 */

export type LeaderboardRow = {
  nickname: string | null;
  model: string | null;
  height_m: number | string | null;
  air_time_ms: number | string | null;
  created_at: string | null;
};

export type AnnouncementRow = {
  id: string | number;
  title: string | null;
  body: string | null;
  kind: string | null;
  level: string | null;
  display: string | null;
  dismissible: boolean | null;
  pinned: boolean | null;
  starts_at: string | null;
  ends_at: string | null;
  min_version_code: number | null;
  max_version_code: number | null;
};

/** 球榜一次最多拉 50 条 */
export const LEADERBOARD_LIMIT = 50;

export async function getLeaderboard(
  limit: number = LEADERBOARD_LIMIT,
): Promise<LeaderboardRow[]> {
  if (!supabase) {
    console.warn("[data] Supabase 环境变量缺失，全球榜返回空数据");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("leaderboard_top")
      .select("nickname, model, height_m, air_time_ms, created_at")
      .order("height_m", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[data] 读取 leaderboard_top 失败:", error.message);
      return [];
    }
    return (data ?? []) as LeaderboardRow[];
  } catch (err) {
    console.error("[data] 读取 leaderboard_top 异常:", err);
    return [];
  }
}

export async function getAnnouncements(): Promise<AnnouncementRow[]> {
  if (!supabase) {
    console.warn("[data] Supabase 环境变量缺失，公告返回空数据");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("active_announcement")
      .select(
        "id, title, body, kind, level, display, dismissible, pinned, starts_at, ends_at, min_version_code, max_version_code",
      )
      .order("pinned", { ascending: false })
      .order("starts_at", { ascending: false });

    if (error) {
      console.error("[data] 读取 active_announcement 失败:", error.message);
      return [];
    }
    return (data ?? []) as AnnouncementRow[];
  } catch (err) {
    console.error("[data] 读取 active_announcement 异常:", err);
    return [];
  }
}
