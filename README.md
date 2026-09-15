# HelloJump 官网（抛手机测高）

HelloJump 的产品官网。展示玩法、测高原理、功能列表，并直接读取 Supabase 里的
**全球榜**与**公告**做实时展示。

- 技术栈：Next.js 16（App Router）+ TypeScript + Tailwind CSS 4 + `@supabase/supabase-js`
- 只读站点：没有任何登录、表单、写入操作，也不放 APK 下载链接
- 构建期可离线：拿不到后端数据时页面走空状态，`npm run build` 依然会成功

---

## 快速开始

```bash
cd D:/code/jump/website

# 1. 安装依赖（Node 20.9+，本机用的是 Node 24）
npm install

# 2. 配置环境变量
cp .env.example .env.local   # 然后填入真实的 anon key；仓库里已有一份 .env.local

# 3. 开发
npm run dev          # http://localhost:3000

# 4. 生产构建与本地预览
npm run build
npm run start        # http://localhost:3000
```

---

## 环境变量

| 变量 | 说明 | 是否必需 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目地址，形如 `https://<ref>.supabase.co` | 是 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 匿名密钥（anon / publishable key） | 是 |

`.env.local` 不进仓库（`.gitignore` 里已排除，`.env.example` 例外——它只有占位符）。

### 关于这把密钥的安全边界

- 这里用 **anon key 是正确的**：它本来就是公开信息，APK 里也带着同一把，
  换个 key 也拦不住任何人。真正的访问控制由数据库端完成。
- **绝对不要在这里放 `service_role` key。** 那把钥匙能绕过 RLS 读写全库，
  而本项目的变量带 `NEXT_PUBLIC_` 前缀，会被打进浏览器产物里，等于公开泄露。
- 两个视图对 anon 只开放 SELECT：读榜单、读公告，别的一概做不了。

---

## 数据来源

后端在 Supabase 项目的 `jump` schema 下（不是默认的 `public`）。

| 视图 | 用途 | 主要列 |
| --- | --- | --- |
| `jump.leaderboard_top` | 每人最好成绩，按 `height_m` 降序 | `nickname, model, height_m, air_time_ms, created_at` |
| `jump.active_announcement` | 已发布且在生效窗口内的公告 | `id, title, body, kind, level, display, dismissible, pinned, starts_at, ends_at, min_version_code, max_version_code` |

### ⚠️ 必须指定 schema

```ts
createClient(url, anonKey, { db: { schema: "jump" } })
```

PostgREST 默认打第一个 schema（`public`）。漏掉 `db.schema` 会得到一个很有误导性的报错：

```
Could not find the table 'public.leaderboard_top' in the schema cache
```

代码里统一在 `lib/supabase.ts` 里创建客户端，页面不要自己 `createClient`。

### ⚠️ `height_m` 要在前端格式化

Postgres 的 `numeric` 经 PostgREST 吐出来可能是很长的定点数，
例如 `2.214263116800000000000`。直接渲染会很难看，
所以 `lib/format.ts` 里的 `formatHeight()` 统一截成 2 位小数（`2.21 m`）。

### 空数据是常态

`active_announcement` 很可能一条都没有（还没发过公告）。两个列表页都做了友好的空状态，
不会出现白板页面。

---

## 目录结构

```
website/
├─ app/
│  ├─ layout.tsx              根布局：导航 + 页脚 + 全局样式
│  ├─ globals.css             Tailwind 4 主题令牌（与 App 的 Material 3 配色对齐）
│  ├─ page.tsx                首页：Hero / 玩法 / 原理 / 功能 / 截图 / 榜单预览 / 下载
│  ├─ leaderboard/page.tsx    全球榜
│  ├─ announcements/page.tsx  公告与更新日志
│  ├─ privacy/page.tsx        隐私政策（草稿）
│  └─ terms/page.tsx          用户协议（草稿）
├─ components/
│  ├─ SiteHeader.tsx / SiteFooter.tsx
│  ├─ PrincipleDiagram.tsx    测高原理图解（纯 SVG，无外部图片）
│  ├─ LeaderboardList.tsx     榜单列表（客户端组件，负责「加载更多」）
│  ├─ AnnouncementList.tsx    公告列表（客户端组件，负责同页展开）
│  ├─ RankBadge.tsx           名次徽章（前三名金银铜）
│  ├─ ScreenshotSlot.tsx      截图占位框（固定 270 × 585）
│  ├─ EmptyState.tsx / DraftBanner.tsx / Todo.tsx
├─ lib/
│  ├─ supabase.ts             只读客户端（db.schema = 'jump'）
│  ├─ data.ts                 两个视图的查询，异常一律降级为空数组
│  ├─ format.ts               高度 / 时长 / 日期 / 相对时间格式化
│  └─ view.ts                 数据库行 → 视模型（在服务端完成格式化）
└─ .env.example
```

---

## 部署注意

1. **环境变量**：在托管平台（Vercel / Netlify 等）的 Project Settings 里配置
   `NEXT_PUBLIC_SUPABASE_URL` 与 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
   这两个变量是**构建期**注入的（`NEXT_PUBLIC_` 前缀会在 `next build` 时内联进产物），
   所以只改运行环境不改构建环境是无效的——改完必须重新部署一次。
2. **必须有 HTTPS**：Supabase 走 HTTPS，站点本身也应该用 HTTPS。
3. **缓存策略**：读数据的页面都设了 `export const revalidate = 60`，
   属于 ISR——先出一份静态快照，之后每 60 秒后台再生。想改频率改这个导出值。
   需要完全实时就换成 `export const dynamic = "force-dynamic"`。
4. **构建不依赖网络**：`lib/data.ts` 里所有查询都包了 try/catch，
   失败或未配置时返回空数组。所以断网、后端挂了、环境变量漏了，
   `npm run build` 都不会失败（只会渲染出空状态）。
5. **没有中间件**：`middleware.ts` 在 Next.js 16 里已弃用，本项目也不需要。
6. **字体**：使用系统字体栈（含 Microsoft YaHei / PingFang SC），
   不调用 Google Fonts，因此构建期不需要外网。
7. **`window.prompt / confirm / alert` 在 Next 16 不可用**，
   后续要加确认弹窗请自绘模态框。

---

## 待办（发布前）

- [ ] **截图**：首页 `#screenshots` 有三个固定尺寸 270 × 585 的占位框，
      替换成真机截图（建议按 1080 × 2340 导出，比例一致）。
- [ ] **下载区**：目前只写「即将开放」，**没有任何 APK 链接**。
      版权与发布渠道确认后再补。
- [ ] **隐私政策 / 用户协议**：两页都是草稿，顶部有醒目标注，
      正文里用 `【待确认：…】` 标出了所有需要按实际情况核实的点
      （运营主体、联系邮箱、生效日期、适用法律、素材授权等）。
      确认完再移除 `DraftBanner` 与 `Todo` 标记。
- [ ] 若站点要上自定义域名，补充 `app/layout.tsx` 里的 `metadataBase` 与 sitemap。

---

## GitHub Pages 部署

站点是**静态导出**（`output: "export"`），托管在 GitHub Pages：

```
https://easontong.github.io/hellojump-site/
https://easontong.github.io/hellojump-site/privacy/    ← 上架 Play 要填的隐私政策 URL
```

### 为什么是静态导出

GitHub Pages 只能托管静态文件、没有 Node 服务端。带来的取舍：

| | |
| --- | --- |
| **代价** | 没有 ISR / `revalidate` —— 榜单与公告在**构建时固化成快照**，改完不会立刻反映到线上 |
| **补偿** | `.github/workflows/deploy-pages.yml` 每小时定时重建一次；后台改完公告想立刻生效，去 Actions 页面手动跑一次 `workflow_dispatch` |

### 关键配置（改错了会白屏）

`next.config.ts` 里的 **`basePath` / `assetPrefix`**：项目页挂在 `/hellojump-site/` **子路径**下，
不加前缀的话页面 HTML 能打开，但所有 `/_next/*` 静态资源会 404 —— 表现是**白屏**。
前缀由 `NEXT_PUBLIC_BASE_PATH` 控制：CI 里设为 `/hellojump-site`，本地留空。

`public/.nojekyll` 也要保留：防止托管侧忽略 `_next` 目录。

### 本地开发与预览

```bash
npm run dev                      # 开发（HMR，数据每次请求实时取，不受静态导出影响）

# 想按线上 URL 结构预览导出结果：
NEXT_PUBLIC_BASE_PATH=/hellojump-site npm run build
mkdir -p ~/pages-preview && cp -r out ~/pages-preview/hellojump-site
python -m http.server 3002 --directory ~/pages-preview
# 然后访问 http://localhost:3002/hellojump-site/
```

> 静态导出后 **`npm run start` 不再可用** —— 那是给 Node 服务端的。

### CI 需要的仓库密钥

`Settings → Secrets and variables → Actions` 里两个（构建时会被打进产物，其中 anon key 本来就是公开信息）：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

缺任何一个，构建仍然会成功，但页面数据全空（data 层取不到数据时返回空数组，走空状态）——
这是刻意的设计，为的是构建不因网络问题失败。**所以「构建绿」不等于「数据对」，要看页面。**
