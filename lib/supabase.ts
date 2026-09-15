import { createClient } from "@supabase/supabase-js";

/**
 * 只读的 Supabase 客户端。
 *
 * 安全说明（重要）：
 * - 这里用 **anon key**，它本来就是公开信息（APK 里也带着同一把），
 *   数据安全由数据库的 RLS / 视图权限兜底，只能读榜单、看公告。
 * - **绝对不要在这里放 service_role key。** 那把钥匙能绕过 RLS 读写全库，
 *   一旦进了 NEXT_PUBLIC_* 就等于公开泄露。
 * - 只在 NEXT_PUBLIC_* 前缀下暴露这两个变量；它们会出现在浏览器产物里，属于预期行为。
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** 环境变量是否齐全。缺失时页面走空状态，而不是崩掉。 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * 关键：`db.schema = 'jump'`。
 *
 * 榜单和公告都在 Supabase 的自定义 `jump` schema 里，而 PostgREST 默认打
 * `public`。漏掉这一行就会看到很有误导性的报错：
 *   Could not find the table 'public.leaderboard_top' in the schema cache
 */
// 注意：这里不要手写 `: SupabaseClient` 类型标注 —— 它默认 schema 是 "public"，
// 会把下面 `db.schema: "jump"` 推导出的类型顶掉，导致 TS2322。
// 让类型自动推导，`lib/data.ts` 里用 `if (!supabase) return []` 收窄即可。
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      db: { schema: "jump" },
    })
  : null;
