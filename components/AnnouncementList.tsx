"use client";

import { useState } from "react";
import type { AnnouncementItem } from "@/lib/view";

const KIND_STYLE: Record<string, string> = {
  notice: "bg-brand-container text-on-brand-container",
  update: "bg-emerald-50 text-emerald-700",
  event: "bg-amber-50 text-amber-800",
};

const LEVEL_BAR: Record<string, string> = {
  info: "bg-brand",
  warning: "bg-amber-400",
  critical: "bg-red-500",
};

export default function AnnouncementList({
  items,
}: {
  items: AnnouncementItem[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <article
            key={item.id}
            className="card overflow-hidden p-0"
            aria-labelledby={`announcement-${item.id}`}
          >
            <div className="flex">
              <span
                className={`w-1.5 shrink-0 ${LEVEL_BAR[item.level] ?? "bg-brand"}`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  aria-expanded={open}
                  className="flex w-full items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-canvas sm:px-5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.pinned ? (
                        <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-medium text-white">
                          置顶
                        </span>
                      ) : null}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          KIND_STYLE[item.kind] ?? KIND_STYLE.notice
                        }`}
                      >
                        {item.kindLabel}
                      </span>
                      {item.level === "critical" || item.level === "warning" ? (
                        <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted">
                          {item.levelLabel}
                        </span>
                      ) : null}
                      <span className="text-xs tabular-nums text-muted">
                        {item.dateLabel}
                      </span>
                      {item.versionNote ? (
                        <span className="text-xs text-muted">
                          {item.versionNote}
                        </span>
                      ) : null}
                    </div>

                    <h2
                      id={`announcement-${item.id}`}
                      className="mt-2 text-base font-medium text-ink"
                    >
                      {item.title}
                    </h2>

                    {!open ? (
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
                        {item.body}
                      </p>
                    ) : null}
                  </div>

                  <span
                    className="mt-1 shrink-0 text-muted transition-transform"
                    style={{ transform: open ? "rotate(180deg)" : undefined }}
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </button>

                {open ? (
                  <div className="border-t border-line px-4 pb-5 pt-4 sm:px-5">
                    <p className="whitespace-pre-line text-sm leading-7 text-ink">
                      {item.body}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
