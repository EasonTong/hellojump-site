/**
 * 测高原理图解 —— 纯 SVG 手绘，不依赖任何外部图片。
 *
 * 图形内容（|a| 随时间变化的示意波形）：
 *   1. 静止握持：|a| ≈ 9.81 m/s²，一条水平基线（灰色虚线）
 *   2. 抛出冲击峰：离手瞬间手对手机的推力，|a| 瞬间冲高
 *   3. 失重平台：手机离手后只受重力，加速度计读到的 |a| ≈ 0，这段时长就是滞空时间 Δt
 *   4. 接住冲击峰：接住（落地）瞬间再次冲高
 *   5. 回到静止基线
 *
 * 于是：升空与下落用时相同，各为 Δt/2
 *       h = ½·g·(Δt/2)² = g·Δt² / 8
 */

const BRAND = "#1565c0";
const MUTED = "#5a6270";
const LINE = "#98a2b3";

export default function PrincipleDiagram() {
  return (
    <figure className="card overflow-hidden p-0">
      {/* 窄屏下横向滚动，保证图里的标注文字不会被压到看不清 */}
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 760 360"
          className="h-auto w-full min-w-[680px]"
          role="img"
          aria-label="加速度模值随时间变化的示意图：静止时约为 9.81，抛出与接住各有一个冲击峰，中间是一段接近 0 的失重平台，这段平台时长即滞空时间 Δt"
        >
          <defs>
            <linearGradient id="plateauFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BRAND} stopOpacity="0.14" />
              <stop offset="100%" stopColor={BRAND} stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {/* 失重区间(Δt) 背景带 */}
          <rect
            x="216"
            y="40"
            width="290"
            height="230"
            fill="url(#plateauFill)"
          />

          {/* 纵轴 */}
          <line
            x1="84"
            y1="270"
            x2="84"
            y2="44"
            stroke={LINE}
            strokeWidth="1.5"
          />
          <path d="M84 34 L78.5 47 L89.5 47 Z" fill={LINE} />
          <text
            transform="translate(18 165) rotate(-90)"
            textAnchor="middle"
            fontSize="12"
            fill={MUTED}
          >
            加速度模值 |a|（m/s²）
          </text>

          {/* 纵轴刻度 */}
          <line x1="79" y1="200" x2="89" y2="200" stroke={LINE} strokeWidth="1.5" />
          <text x="74" y="204" textAnchor="end" fontSize="11.5" fill={MUTED}>
            9.81
          </text>
          <line x1="79" y1="250" x2="89" y2="250" stroke={LINE} strokeWidth="1.5" />
          <text x="74" y="254" textAnchor="end" fontSize="11.5" fill={MUTED}>
            0
          </text>

          {/* 静止基线 */}
          <line
            x1="84"
            y1="200"
            x2="736"
            y2="200"
            stroke={LINE}
            strokeWidth="1.5"
            strokeDasharray="7 6"
          />
          <text x="726" y="190" textAnchor="end" fontSize="12" fill={MUTED}>
            静止时 |a| ≈ 9.81 m/s²
          </text>

          {/* 时间轴 */}
          <line x1="84" y1="270" x2="742" y2="270" stroke={LINE} strokeWidth="1.5" />
          <path d="M750 270 L739 264.5 L739 275.5 Z" fill={LINE} />
          <text x="736" y="290" textAnchor="end" fontSize="12" fill={MUTED}>
            时间 t
          </text>

          {/* 波形：静止 → 抛出冲击峰 → 失重平台（带噪声） → 接住冲击峰 → 静止 */}
          <path
            d="M 84 200 L 166 200
               C 176 200 178 56 188 56
               C 198 56 202 250 216 250
               q 10 -5 20 0 q 10 5 20 0 q 10 -5 20 0 q 10 5 20 0
               q 10 -5 20 0 q 10 5 20 0 q 10 -5 20 0 q 10 5 20 0
               q 10 -5 20 0 q 10 5 20 0 q 10 -5 20 0 q 10 5 20 0
               q 10 -5 20 0 q 10 5 20 0
               C 506 250 510 44 522 44
               C 532 44 536 200 550 200
               L 736 200"
            fill="none"
            stroke={BRAND}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 冲击峰标注 */}
          <text x="188" y="44" textAnchor="middle" fontSize="12.5" fill={MUTED}>
            抛出冲击峰
          </text>
          <text x="522" y="32" textAnchor="middle" fontSize="12.5" fill={MUTED}>
            接住冲击峰
          </text>
          <text x="355" y="332" textAnchor="middle" fontSize="11" fill={MUTED}>
            冲击瞬间 |a| 可达数十 m/s²
          </text>

          {/* 失重平台标注 */}
          <text x="361" y="228" textAnchor="middle" fontSize="12.5" fill={BRAND}>
            顶点 v = 0
          </text>
          <text x="361" y="243" textAnchor="middle" fontSize="12.5" fill={BRAND}>
            失重段 |a| ≈ 0（自由落体）
          </text>
          <circle cx="361" cy="250" r="3.2" fill={BRAND} />

          {/* Δt 区间标注 */}
          <path
            d="M216 252 L216 312 L506 312 L506 252"
            fill="none"
            stroke={BRAND}
            strokeWidth="1.6"
            strokeDasharray="4 4"
          />
          <text x="361" y="344" textAnchor="middle" fontSize="13" fill={BRAND}>
            Δt = 滞空时间（从离手到接住）
          </text>
        </svg>
      </div>

      <figcaption className="border-t border-line px-5 py-4 text-xs leading-relaxed text-muted">
        示意图：纵轴为加速度模值 |a|，横轴为时间。波形形态与真实采样一致，
        纵向刻度为示意（冲击峰按比例压缩），不代表线性比例。
      </figcaption>
    </figure>
  );
}
