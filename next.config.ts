import type { NextConfig } from "next";

/**
 * 静态导出，托管到 GitHub Pages。
 *
 * 三个必须点，缺一个都会在线上炸：
 *
 * 1. `output: "export"` —— Pages 只托管静态文件、没有 Node 服务端。
 *    连带后果：**ISR / revalidate 一律不可用**，所有数据在构建时固化成快照。
 *    榜单和公告的新鲜度因此依赖「定时重新构建」（见 .github/workflows/deploy-pages.yml）。
 *
 * 2. `basePath` / `assetPrefix` —— 项目页的地址是 `/hellojump-site/` 而不是域名根，
 *    不设的话页面 HTML 能打开，但所有 `/_next/*` 静态资源都会 404（白屏）。
 *    用环境变量控制：本地开发不带前缀，CI 里带上，两边互不干扰。
 *
 * 3. `images.unoptimized` —— 静态导出没有图片优化服务，必须关掉。
 *    （目前页面没有用 next/image，留着是为了以后加了不会突然构建失败。）
 *
 * `trailingSlash: true` 让每个页面产出 `xxx/index.html`，
 * 这样 `/privacy/` 这种目录式 URL 在任何静态托管上都能解析 —— 包括 GitHub Pages。
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
