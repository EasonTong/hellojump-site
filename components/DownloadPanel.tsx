import Link from "next/link";
import type { ReleaseRow } from "@/lib/data";
import { formatSize } from "@/lib/format";

/**
 * 下载与分发渠道面板。
 *
 * 数据来自只读视图 `jump.public_release`，由管理后台维护（表 `jump.app_release`）。
 * 一份数据同时喂三个地方：本面板、App 内的版本更新提示、版本历史。
 *
 * 状态语义（视图里只会出现前两种）：
 *   live     已上线 —— 有 url，渲染成真链接
 *   upcoming 即将上架 —— **url 是空的**，必须渲染成禁用态而不是空链接
 */

type ChannelSpec = {
  channel: string;
  platform: string;
  name: string;
  tagline: string;
};

/** 数组顺序 = 展示顺序。GitHub 的 APK 放最前，因为它是唯一能立刻装的 */
const CHANNELS: ChannelSpec[] = [
  {
    channel: "github",
    platform: "android",
    name: "Android 安装包（APK）",
    tagline: "从 GitHub Releases 直接下载，需要在系统设置里允许安装未知来源应用",
  },
  {
    channel: "google",
    platform: "android",
    name: "Google Play",
    tagline: "安卓商店版，可自动更新",
  },
  {
    channel: "appstore",
    platform: "ios",
    name: "App Store",
    tagline: "iOS 版本",
  },
];

function pickRelease(
  releases: ReleaseRow[],
  channel: string,
  platform: string,
): ReleaseRow | null {
  return (
    releases.find((r) => r.channel === channel && r.platform === platform) ?? null
  );
}

export default function DownloadPanel({ releases }: { releases: ReleaseRow[] }) {
  const rows = CHANNELS.map((spec) => ({
    spec,
    release: pickRelease(releases, spec.channel, spec.platform),
  }));

  // 一条可点的都没有时，给一句总说明，而不是让用户对着一排灰按钮猜
  const anyLive = rows.some(
    ({ release }) => !!release && release.status === "live" && !!release.url,
  );

  return (
    <div className="mx-auto max-w-3xl">
      {!anyLive && (
        <p className="mb-6 rounded-xl border border-line bg-canvas px-4 py-3 text-center text-sm text-muted">
          所有渠道都还没开放。开放后会在
          <Link href="/announcements" className="mx-1 text-brand underline">
            公告页
          </Link>
          第一时间说明。
        </p>
      )}

      <ul className="space-y-3">
        {rows.map(({ spec, release }) => (
          <ReleaseItem
            key={`${spec.channel}:${spec.platform}`}
            spec={spec}
            release={release}
          />
        ))}
      </ul>

      {/*
        这条是真会咬人的坑：Google Play 用 App Signing，分发出去的包由 Google 的密钥签名，
        而自签的 APK 用的是你自己的密钥 —— 同一个包名但签名不同，装第二个会失败。
      */}
      <p className="mt-6 text-xs leading-relaxed text-muted">
        注意：旁加载的 APK 与 Google Play 版本的签名密钥不同（Play 用 Google 的签名密钥）。
        同一个包名只能装其中一个，换渠道前需要先卸载旧版本。
      </p>
    </div>
  );
}

function ReleaseItem({
  spec,
  release,
}: {
  spec: ChannelSpec;
  release: ReleaseRow | null;
}) {
  const url = release && release.status === "live" ? (release.url ?? "") : "";
  const live = url.length > 0;

  const version = release?.version_name?.trim() || null;
  const size = formatSize(release?.size_bytes);

  return (
    <li className="card flex flex-wrap items-center gap-4 p-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-ink">{spec.name}</span>
          {version && (
            <span className="rounded bg-canvas px-1.5 py-0.5 text-xs text-muted">
              v{version}
            </span>
          )}
          {live && size && <span className="text-xs text-muted">{size}</span>}
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted">{spec.tagline}</p>
      </div>

      {live ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary shrink-0"
        >
          前往下载
        </a>
      ) : (
        // 禁用态用 span 而不是 disabled 的 button：语义上它不是一个可交互控件，
        // 用 button 会让键盘焦点停在一个点了没反应的东西上
        <span
          className="shrink-0 cursor-not-allowed rounded-lg bg-canvas px-4 py-2 text-sm text-muted"
          aria-disabled="true"
        >
          {release ? "即将上架" : "暂无计划"}
        </span>
      )}
    </li>
  );
}
