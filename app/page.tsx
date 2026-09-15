import Link from "next/link";
import { getLeaderboard, getReleases } from "@/lib/data";
import { toLeaderboardItems } from "@/lib/view";
import PrincipleDiagram from "@/components/PrincipleDiagram";
import ScreenshotSlot from "@/components/ScreenshotSlot";
import RankBadge from "@/components/RankBadge";
import DownloadPanel from "@/components/DownloadPanel";

/**
 * 首页会读远程榜单做「当前纪录」和榜前预览。
 * revalidate = 60：构建时先渲染一份，之后每 60 秒后台再生一次；
 * 取不到数据时 data 层返回空数组，页面走空状态，构建不会失败。
 */
export const revalidate = 60;

const STEPS = [
  {
    title: "点击圆按钮",
    desc: "打开 App，按下屏幕中央的大圆按钮，开始一次记录。",
  },
  {
    title: "3‑2‑1 倒数",
    desc: "三秒准备时间：握稳手机，确认头顶有足够空间，周围没人。",
  },
  {
    title: "START",
    desc: "屏幕弹出 START，提示可以出手。",
  },
  {
    title: "向上抛",
    desc: "竖直向上抛起。手机离手后进入失重，加速度计开始记录这段时长 Δt。",
  },
  {
    title: "庆祝动画",
    desc: "接住（或落地）瞬间自动判定结束，播放庆祝动画。",
  },
  {
    title: "显示结果",
    desc: "给出滞空时间与换算出的抛掷高度。",
  },
  {
    title: "确认",
    desc: "确认后计入本机个人纪录，并同步到全球榜。",
  },
];

const FEATURES: { icon: string; title: string; desc: string }[] = [
  {
    icon: "wave",
    title: "实时加速度波形",
    desc: "三轴加速度实时绘制成波形，抛掷全程一目了然，误判时也能一眼看出问题在哪。",
  },
  {
    icon: "sliders",
    title: "抛掷测高调参页",
    desc: "自由落体判定阈值、平台最短持续时间等参数可直接调，实地校准不用改代码、不用重装。",
  },
  {
    icon: "music",
    title: "背景音乐盒 + 64 柱频谱",
    desc: "内置背景音乐盒，64 根频谱柱环绕大按钮实时跳动，抛之前先热个身。",
  },
  {
    icon: "list",
    title: "个人记录排行",
    desc: "本机的历史成绩按高度排序，随时回看自己的进步曲线。",
  },
  {
    icon: "globe",
    title: "全球榜",
    desc: "匿名昵称 + 机型 + 高度，与所有玩家同榜比较，看看谁的手更稳。",
  },
];

const SCREENSHOTS = [
  {
    title: "主界面",
    hint: "中央大圆按钮 + 环绕的 64 柱音频频谱 + 开始提示",
  },
  {
    title: "抛掷结果",
    hint: "滞空时间 Δt、换算高度、确认 / 重抛按钮",
  },
  {
    title: "全球榜",
    hint: "名次列表：昵称、机型、高度、时间",
  },
];

const PRINCIPLE_STEPS = [
  "手机离手后只受重力，进入自由落体。这时加速度计读到的合加速度 |a| ≈ 0，也就是「失重」。",
  "波形上两个冲击峰之间那一段接近 0 的平台，就是空中的全部时间 —— 即滞空时间 Δt。",
  "上升和下落用时相等，各占一半：t = Δt / 2。",
  "把最高点当作起点做自由落体：h = ½ · g · (Δt/2)²。",
  "化简后就是 App 里用的那一行：h = g · Δt² / 8。",
];

function FeatureIcon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-5 w-5",
    "aria-hidden": true,
  };
  switch (name) {
    case "wave":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M2 12h3l2.5-6 3 12L13.5 9 16 12h6" />
        </svg>
      );
    case "sliders":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
          <circle cx="16" cy="6" r="2" />
          <circle cx="10" cy="12" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );
    case "music":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M9 18V6l10-2v12" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="16.5" cy="16" r="2.5" />
        </svg>
      );
    case "list":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
        </svg>
      );
  }
}

export default async function HomePage() {
  const now = Date.now();
  const [rows, releases] = await Promise.all([getLeaderboard(50), getReleases()]);
  const items = toLeaderboardItems(rows, now);
  const top = items[0];
  const preview = items.slice(0, 5);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line bg-white">
        <div
          className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-brand-container opacity-60 blur-3xl"
          aria-hidden="true"
        />
        <div className="shell relative grid items-center gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-container px-3 py-1 text-xs font-medium text-on-brand-container">
              Android · 加速度计测高
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              HelloJump
              <span className="mt-2 block text-2xl font-medium text-muted sm:text-3xl">
                抛手机测高
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              把手机竖直抛向空中。App 用加速度计读出空中的失重时长，
              一行公式算出你抛了多高 —— 不用摄像头，不用标尺，只看手机自由落体了多久。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#principle" className="btn-primary">
                看看怎么测的
              </a>
              <a href="#leaderboard" className="btn-secondary">
                查看全球榜
              </a>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <dt className="text-xs text-muted">榜单收录</dt>
                <dd className="mt-1 text-xl font-semibold tabular-nums">
                  {items.length > 0 ? items.length : "—"} 位玩家
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">当前最高</dt>
                <dd className="mt-1 text-xl font-semibold tabular-nums text-brand">
                  {top ? top.height : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">测高公式</dt>
                <dd className="mt-1 font-mono text-xl font-semibold">
                  g·Δt²/8
                </dd>
              </div>
            </dl>
          </div>

          {/* 实时纪录卡：数据来自 Supabase 的 jump.leaderboard_top 视图 */}
          <div className="card p-6 shadow-[0_1px_2px_rgba(26,28,30,0.04)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted">实时榜首</p>
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                来自云端榜单
              </span>
            </div>

            {top ? (
              <div className="mt-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold tabular-nums text-brand">
                    {top.height.replace(" m", "")}
                  </span>
                  <span className="text-lg text-muted">m</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <RankBadge rank={top.rank} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{top.nickname}</p>
                    <p className="truncate text-xs text-muted">{top.model}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
                  <div>
                    <p className="text-xs text-muted">滞空时间</p>
                    <p className="mt-0.5 font-medium tabular-nums">
                      {top.airTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">达成时间</p>
                    <p className="mt-0.5 font-medium">{top.when}</p>
                  </div>
                </div>
                <p className="mt-5 rounded-xl bg-canvas px-3 py-2.5 text-xs leading-relaxed text-muted">
                  按 h = g·Δt²/8 反推，{top.airTime} 的滞空时间对应约{" "}
                  {top.height} 的高度。
                </p>
              </div>
            ) : (
              <div className="mt-5">
                <p className="text-2xl font-semibold">暂无记录</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  云端榜单还没有成绩。等 App 端有第一条上传后，这里会自动显示。
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 玩法 ───────────────────────────────────────────── */}
      <section id="howto" className="shell scroll-mt-24 py-16 md:py-20">
        <header className="max-w-2xl">
          <p className="text-sm font-medium text-brand">玩法</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            一次抛掷，七步结束
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            从按下按钮到确认成绩，全过程不超过十秒。抛的时候记得清空头顶，
            并确认脚下是柔软的地面。
          </p>
        </header>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="card p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-container text-sm font-semibold text-on-brand-container tabular-nums">
                  {i + 1}
                </span>
                <h3 className="font-medium">{step.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── 测高原理 ───────────────────────────────────────── */}
      <section
        id="principle"
        className="scroll-mt-24 border-y border-line bg-white py-16 md:py-20"
      >
        <div className="shell">
          <header className="max-w-2xl">
            <p className="text-sm font-medium text-brand">测高原理</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              只看一段「失重平台」，就能算出高度
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              手机静止握在手里时，加速度计读到的合加速度就是重力加速度，
              |a| ≈ 9.81 m/s²。一旦离手做自由落体，合加速度几乎为零 ——
              波形上会出现一段被两个冲击峰夹住的平台，平台的时长就是滞空时间 Δt。
            </p>
          </header>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="min-w-0">
              <PrincipleDiagram />

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
                <span className="flex items-center gap-2">
                  <span className="h-0.5 w-6 rounded bg-brand" />
                  实测 |a| 波形
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-0.5 w-6 rounded bg-[#98a2b3]" />
                  静止基线 9.81 m/s²
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-6 rounded bg-brand/10 ring-1 ring-brand/20" />
                  失重区间 Δt
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="card p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  公式
                </p>
                <p className="mt-4 text-center font-mono text-xl leading-relaxed">
                  h = ½ · g · (Δt / 2)²
                </p>
                <p className="mt-1 text-center font-mono text-xl leading-relaxed text-brand">
                  = g · Δt² / 8
                </p>
                <p className="mt-4 border-t border-line pt-4 text-xs text-muted">
                  g 取 9.81 m/s²，Δt 为滞空时间（秒），h 为高度（米）
                </p>
              </div>

              <div className="card p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  推导
                </p>
                <ol className="mt-4 space-y-3">
                  {PRINCIPLE_STEPS.map((step, i) => (
                    <li key={step} className="flex gap-3 text-sm leading-relaxed">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-canvas text-[11px] font-semibold text-muted tabular-nums">
                        {i + 1}
                      </span>
                      <span className="text-ink">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="card bg-brand-container/40 p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-on-brand-container">
                  举个例子
                </p>
                <p className="mt-3 text-sm leading-relaxed text-on-brand-container">
                  滞空 <span className="font-mono font-semibold">Δt = 1.34 s</span>
                  ，代入 h = 9.81 × 1.34² / 8 ≈{" "}
                  <span className="font-mono font-semibold">2.20 m</span>。
                </p>
                <p className="mt-3 text-xs leading-relaxed text-on-brand-container/80">
                  注意高度按 Δt 的平方增长：滞空时间翻倍，高度就是四倍。
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted">
            判定细节：抛出和接住两个瞬间 |a| 会冲高到几十 m/s²，App 用阈值来判定平台的起止，
            再用「平台最短持续时间」过滤掉普通晃动和走路时的抖动，避免把日常动作误判成抛掷。
            阈值都放在调参页里，可以按自己的手机型号微调。
          </p>
        </div>
      </section>

      {/* ── 功能 ───────────────────────────────────────────── */}
      <section id="features" className="shell scroll-mt-24 py-16 md:py-20">
        <header className="max-w-2xl">
          <p className="text-sm font-medium text-brand">功能</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            不只是抛一下那么简单
          </h2>
        </header>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <li key={f.title} className="card p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-container text-on-brand-container">
                <FeatureIcon name={f.icon} />
              </span>
              <h3 className="mt-4 font-medium">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {f.desc}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 截图 ───────────────────────────────────────────── */}
      <section
        id="screenshots"
        className="scroll-mt-24 border-y border-line bg-white py-16 md:py-20"
      >
        <div className="shell">
          <header className="max-w-2xl">
            <p className="text-sm font-medium text-brand">界面</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              截图位置（待补充）
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              下方三个占位框尺寸固定为 270 × 585（约 9 : 19.5）。
              换成真机截图时按同样比例导出即可，页面布局不会跳动。
            </p>
          </header>

          <div className="mt-10 flex flex-wrap justify-center gap-8 lg:justify-start">
            {SCREENSHOTS.map((shot, i) => (
              <ScreenshotSlot
                key={shot.title}
                index={i + 1}
                title={shot.title}
                hint={shot.hint}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 全球榜预览 ─────────────────────────────────────── */}
      <section id="leaderboard" className="shell scroll-mt-24 py-16 md:py-20">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-brand">全球榜</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              看看现在谁抛得最高
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              同一台设备只保留最好的一次成绩，按高度降序排列。
            </p>
          </div>
          <Link href="/leaderboard" className="btn-secondary">
            查看完整榜单
          </Link>
        </header>

        {preview.length > 0 ? (
          <ol className="card mt-10 overflow-hidden p-0">
            {preview.map((item) => (
              <li
                key={`${item.rank}-${item.nickname}`}
                className="flex items-center gap-4 border-b border-line px-4 py-3.5 last:border-b-0 sm:px-5"
              >
                <RankBadge rank={item.rank} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.nickname}</p>
                  <p className="truncate text-xs text-muted">{item.model}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold tabular-nums text-brand">
                    {item.height}
                  </p>
                  <p className="text-xs tabular-nums text-muted">
                    {item.airTime} · {item.when}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="card mt-10 px-6 py-12 text-center">
            <p className="font-medium">榜单还是空的</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              暂时没拉到榜单数据（可能是网络问题，或云端还没有成绩）。
              稍后刷新页面再试。
            </p>
          </div>
        )}
      </section>

      {/* ── 下载（占位） ───────────────────────────────────── */}
      <section
        id="download"
        className="scroll-mt-24 border-t border-line bg-white py-16 md:py-20"
      >
        <div className="shell">
          <DownloadPanel releases={releases} />
        </div>
      </section>
    </>
  );
}
