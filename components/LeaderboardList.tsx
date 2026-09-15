"use client";

import { useState } from "react";
import type { LeaderboardItem } from "@/lib/view";
import RankBadge from "@/components/RankBadge";

/** 一次先显示多少条，其余点「加载更多」再展开 */
const PAGE_SIZE = 10;

export default function LeaderboardList({ items }: { items: LeaderboardItem[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = items.slice(0, visible);
  const remaining = items.length - shown.length;

  return (
    <div className="card overflow-hidden p-0">
      <ol>
        {shown.map((item) => (
          <li
            key={`${item.rank}-${item.nickname}-${item.height}`}
            className="flex items-center gap-4 border-b border-line px-4 py-3.5 last:border-b-0 sm:px-5"
          >
            <RankBadge rank={item.rank} />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {item.nickname}
              </p>
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

      <div className="flex flex-col items-center gap-2 border-t border-line bg-canvas px-4 py-4">
        <p className="text-xs text-muted">
          已显示 {shown.length} / {items.length} 条
        </p>
        {remaining > 0 ? (
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="btn-secondary"
          >
            加载更多（还有 {remaining} 条）
          </button>
        ) : null}
      </div>
    </div>
  );
}
