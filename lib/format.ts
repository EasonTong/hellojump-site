/**
 * 展示层格式化工具。
 *
 * 全部在服务端调用，把结果作为字符串传给客户端组件 —— 这样服务端渲染出的 HTML
 * 与客户端 hydration 的结果完全一致，不会出现「3 分钟前 / 4 分钟前」这种
 * hydration mismatch 警告。
 */

/** null / undefined / NaN / 非数字字符串统一转成 null */
function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(n) ? n : null;
}

/**
 * 高度格式化。
 *
 * Postgres 的 numeric 经 PostgREST 吐出来可能是一串很长的定点数
 * （例如 `2.214263116800000000000`），直接显示会很难看，
 * 这里统一截成 2 位小数。
 */
export function formatHeight(value: number | string | null | undefined): string {
  const n = toNumber(value);
  if (n === null) return "—";
  return `${n.toFixed(2)} m`;
}

/** 滞空时间：毫秒 → 秒，保留 2 位小数 */
export function formatAirTime(value: number | string | null | undefined): string {
  const n = toNumber(value);
  if (n === null) return "—";
  return `${(n / 1000).toFixed(2)} s`;
}

/** 日期：按北京时间输出 YYYY-MM-DD，避免服务器时区（常见为 UTC）影响展示 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "—";
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(t));
  const pick = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${pick("year")}-${pick("month")}-${pick("day")}`;
}

/** 日期时间：按北京时间输出 YYYY-MM-DD HH:mm */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "—";
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(t));
  const pick = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${pick("year")}-${pick("month")}-${pick("day")} ${pick("hour")}:${pick("minute")}`;
}

/**
 * 相对时间：「3 分钟前」这种。
 * `nowMs` 由服务端传入，保证同一次渲染里的所有行用同一个基准时间。
 */
export function formatRelativeTime(
  iso: string | null | undefined,
  nowMs: number,
): string {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "—";

  const diff = nowMs - t;
  if (diff < 0) return "刚刚";

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return seconds <= 10 ? "刚刚" : `${seconds} 秒前`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} 分钟前`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;

  return formatDate(iso);
}

/**
 * 安装包体积：字节 → MB。
 *
 * 没值返回 `null` 而不是 `"0 MB"` —— 调用方据此决定整个元素显不显示，
 * 免得后台还没填体积时页面上出现一个「0 MB」。
 */
export function formatSize(
  bytes: number | string | null | undefined,
): string | null {
  const n = toNumber(bytes);
  if (n === null || n <= 0) return null;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
