/**
 * 截图占位框。
 *
 * 尺寸固定（270 × 585，接近 9:19.5 的手机比例），后续替换成真图时
 * 按同样的宽高比导出即可，不会引起布局跳动。
 * 这里刻意不画任何「假界面」，只标明该放什么截图。
 */
export default function ScreenshotSlot({
  index,
  title,
  hint,
}: {
  index: number;
  title: string;
  hint: string;
}) {
  return (
    <figure className="flex flex-col items-center">
      <div className="relative h-[585px] w-[270px] shrink-0 overflow-hidden rounded-[28px] border-2 border-dashed border-line bg-white">
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-container text-on-brand-container">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.6" />
              <path d="m3 17 5-5 4 4 3-3 6 6" />
            </svg>
          </span>
          <p className="text-sm font-medium text-ink">
            截图位置 {index}
          </p>
          <p className="text-sm text-brand">{title}</p>
          <p className="text-xs leading-relaxed text-muted">{hint}</p>
          <p className="mt-2 text-[11px] text-muted">
            建议尺寸 1080 × 2340
            <br />
            （9 : 19.5）
          </p>
        </div>
        <span className="absolute inset-x-0 bottom-0 border-t border-dashed border-line bg-canvas py-1.5 text-center text-[11px] text-muted">
          待补充真机截图
        </span>
      </div>
      <figcaption className="mt-3 text-xs text-muted">
        图 {index} · {title}
      </figcaption>
    </figure>
  );
}
