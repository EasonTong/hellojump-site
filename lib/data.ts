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

/**
 * 分发渠道与版本（视图 `jump.public_release`）。
 *
 * 视图刻意不输出 `sha256` —— 那是给客户端做完整性校验用的，
 * 没必要摆在官网上当公开信息。
 */
export type ReleaseRow = {
  id: string | number;
  channel: string | null;
  platform: string | null;
  version_code: number | null;
  version_name: string | null;
  external_id: string | null;
  url: string | null;
  size_bytes: number | string | null;
  min_os: string | null;
  changelog: string | null;
  status: string | null;
  published_at: string | null;
};

/**
 * 读分发渠道。视图里只有 `live`（已上线）和 `upcoming`（即将上架）两种状态，
 * 草稿和已下架的行不会出现。
 */
export async function getReleases(): Promise<ReleaseRow[]> {
  if (!supabase) {
    console.warn("[data] Supabase 环境变量缺失，下载渠道返回空数据");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("public_release")
      .select(
        "id, channel, platform, version_code, version_name, external_id, url, size_bytes, min_os, changelog, status, published_at",
      )
      .order("platform", { ascending: true })
      .order("channel", { ascending: true });

    if (error) {
      console.error("[data] 读取 public_release 失败:", error.message);
      return [];
    }
    return (data ?? []) as ReleaseRow[];
  } catch (err) {
    console.error("[data] 读取 public_release 异常:", err);
    return [];
  }
}
