import type { AnnouncementRow, LeaderboardRow } from "./data";
import {
  formatAirTime,
  formatDate,
  formatHeight,
  formatRelativeTime,
} from "./format";

/**
 * 视图模型：把数据库行转成「已经格式化好的字符串」。
 *
 * 全部在服务端完成，客户端组件只负责显示/展开，不再做时间或数字计算 ——
 * 这样 SSR 出的 HTML 与 hydration 结果逐字一致，不会触发 mismatch 警告。
 */

export type LeaderboardItem = {
  rank: number;
  nickname: string;
  model: string;
  height: string;
  airTime: string;
  when: string;
};

export type AnnouncementItem = {
  id: string;
  title: string;
  body: string;
  kind: string;
  kindLabel: string;
  level: string;
  levelLabel: string;
  pinned: boolean;
  dateLabel: string;
  versionNote: string | null;
};

const KIND_LABELS: Record<string, string> = {
  notice: "通知",
  update: "更新",
  event: "活动",
};

const LEVEL_LABELS: Record<string, string> = {
  info: "提示",
  warning: "注意",
  critical: "重要",
};

function text(value: string | null | undefined, fallback: string): string {
  const s = (value ?? "").trim();
  return s.length > 0 ? s : fallback;
}

function buildVersionNote(row: AnnouncementRow): string | null {
  const min = row.min_version_code;
  const max = row.max_version_code;
  if (min === null && max === null) return null;
  if (min !== null && max !== null) return `适用版本 ${min} – ${max}`;
  if (min !== null) return `适用版本 ≥ ${min}`;
  return `适用版本 ≤ ${max}`;
}

export function toLeaderboardItems(
  rows: LeaderboardRow[],
  nowMs: number,
): LeaderboardItem[] {
  return rows.map((row, index) => ({
    rank: index + 1,
    nickname: text(row.nickname, "匿名玩家"),
    model: text(row.model, "未知机型"),
    height: formatHeight(row.height_m),
    airTime: formatAirTime(row.air_time_ms),
    when: formatRelativeTime(row.created_at, nowMs),
  }));
}

export function toAnnouncementItems(
  rows: AnnouncementRow[],
): AnnouncementItem[] {
  return rows.map((row) => {
    const kind = (row.kind ?? "notice").toLowerCase();
    const level = (row.level ?? "info").toLowerCase();
    return {
      id: String(row.id),
      title: text(row.title, "（无标题）"),
      body: text(row.body, "（本条公告没有正文）"),
      kind,
      kindLabel: KIND_LABELS[kind] ?? "通知",
      level,
      levelLabel: LEVEL_LABELS[level] ?? "提示",
      pinned: Boolean(row.pinned),
      dateLabel: formatDate(row.starts_at),
      versionNote: buildVersionNote(row),
    };
  });
}
