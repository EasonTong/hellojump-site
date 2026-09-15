import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-white">
      <div className="shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <rect x="8" y="10" width="8" height="11" rx="2.2" />
                <path d="M12 7.2V2" />
                <path d="M9.6 4.6 12 2l2.4 2.6" />
              </svg>
            </span>
            <span className="font-semibold">HelloJump</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            一个把手机抛向空中的小游戏：用加速度计读出失重时长，算出你把手机抛了多高。
            个人练手项目，非商业用途。
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold">站点</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-brand">
                首页
              </Link>
            </li>
            <li>
              <Link
                href="/leaderboard"
                className="transition-colors hover:text-brand"
              >
                全球榜
              </Link>
            </li>
            <li>
              <Link
                href="/announcements"
                className="transition-colors hover:text-brand"
              >
                公告与更新
              </Link>
            </li>
            <li>
              <Link
                href="/#download"
                className="transition-colors hover:text-brand"
              >
                下载
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">条款</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li>
              <Link href="/privacy" className="transition-colors hover:text-brand">
                隐私政策
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-brand">
                用户协议
              </Link>
            </li>
            <li>
              <Link
                href="/announcements"
                className="transition-colors hover:text-brand"
              >
                更新日志
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} HelloJump · 抛手机测高</p>
          <p>
            ⚠️ 抛掷手机有损坏风险，请在柔软表面上、无人处谨慎尝试。
          </p>
        </div>
      </div>
    </footer>
  );
}
