/** 空状态 / 降级提示：数据为空或拉取失败时用，避免出现一片空白。 */
export default function EmptyState({
  icon = "chart",
  title,
  description,
  action,
}: {
  icon?: "chart" | "bell";
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-container text-on-brand-container">
        {icon === "chart" ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M4 20V10" />
            <path d="M10 20V4" />
            <path d="M16 20v-7" />
            <path d="M22 20H2" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M18 8a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7" />
            <path d="M10.3 20a2 2 0 0 0 3.4 0" />
          </svg>
        )}
      </span>
      <p className="text-base font-medium text-ink">{title}</p>
      <p className="max-w-md text-sm leading-relaxed text-muted">
        {description}
      </p>
      {action}
    </div>
  );
}
