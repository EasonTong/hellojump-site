import Link from "next/link";

const nav = [
  { href: "/#howto", label: "玩法" },
  { href: "/#principle", label: "测高原理" },
  { href: "/leaderboard", label: "全球榜" },
  { href: "/announcements", label: "公告" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/85 backdrop-blur">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="HelloJump 首页"
        >
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
          <span className="flex items-baseline gap-2">
            <span className="text-[15px] font-semibold tracking-tight">
              HelloJump
            </span>
            <span className="hidden text-xs text-muted sm:inline">
              抛手机测高
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-brand-container hover:text-on-brand-container"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
