import type { Metadata } from "next";
import Link from "next/link";
import DraftBanner from "@/components/DraftBanner";
import Todo from "@/components/Todo";

export const metadata: Metadata = {
  title: "隐私政策",
  description:
    "HelloJump 抛手机测高的隐私政策草稿：说明会生成随机设备标识、上报设备机型，不收集姓名 / 手机号 / 位置 / 通讯录，数据托管在 Supabase，以及如何删除数据。",
};

const COLLECTED = [
  {
    item: "随机设备标识",
    detail:
      "首次运行时由 App 在本机生成的随机 UUID（v4），例如 8f14e45f-ceea-467a-9f3b-1b2c3d4e5f60。它不是手机的硬件序列号，也不来自任何系统级标识。",
    purpose: "区分成绩归属：让同一台设备的多次成绩算作同一个人。",
    required: "必需",
  },
  {
    item: "设备机型",
    detail:
      "系统报告的机型字符串，例如「Xiaomi 24117RK2CC」「Sony XQ-ES72」。",
    purpose: "在榜单上显示机型，便于理解成绩差异。",
    required: "必需",
  },
  {
    item: "昵称",
    detail:
      "由你在 App 内填写；未填写时自动取设备标识的末 4 位，例如「跳跃的A3F9」。",
    purpose: "在榜单上展示你的名字。",
    required: "必需",
  },
  {
    item: "成绩数据",
    detail:
      "每次抛掷的滞空时间（毫秒）、按公式换算出的高度（米）、提交时间。",
    purpose: "计算排名，展示榜单。",
    required: "必需",
  },
];

const NOT_COLLECTED = [
  "姓名、手机号、邮箱、身份证号等任何身份信息 —— 本应用没有注册和登录。",
  "位置信息 —— App 没有申请任何定位相关权限，也不读取 GPS 或网络定位。",
  "通讯录、短信、通话记录、相册、文件 —— 未申请相关权限，无法访问。",
  "剪贴板内容、已安装应用列表、广告标识符（GAID）。",
  "传感器原始数据 —— 加速度波形只在你手机的内存里用于当场计算，不会上传。",
];

export default function PrivacyPage() {
  return (
    <div className="shell max-w-3xl py-14 md:py-20">
      <header>
        <p className="text-sm font-medium text-brand">法律条款</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          隐私政策
        </h1>
        <p className="mt-4 leading-relaxed text-muted">
          HelloJump（抛手机测高）尊重你的隐私。这份文档说明我们收集什么、不收集什么、
          数据放在哪里，以及你可以怎么把它删掉。
        </p>
      </header>

      <div className="mt-8">
        <DraftBanner what="隐私政策" />
      </div>

      <div className="mt-8 space-y-2 text-sm text-muted">
        <p>
          适用应用：HelloJump（抛手机测高）Android 版
        </p>
        <p>
          生效日期：<Todo>填入正式生效日期</Todo>　最近更新：
          <Todo>填入更新日期</Todo>
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          一句话总结
        </h2>
        <p className="mt-3 text-sm leading-7">
          App 会用一串<strong>随机生成的设备标识</strong>来区分成绩是谁的，并把
          <strong>机型、昵称、成绩</strong>上传到云端榜单。
          它<strong>不知道你是谁</strong>：没有姓名、没有手机号、没有位置、没有通讯录。
          想清除这些数据，清掉应用数据即可重置身份。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          1. 我们收集哪些信息
        </h2>
        <p className="mt-3 text-sm leading-7">
          只有下面这四项会上传到服务器。除此之外没有别的。
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="py-3 pr-4 font-medium">数据项</th>
                <th className="py-3 pr-4 font-medium">具体内容</th>
                <th className="py-3 pr-4 font-medium">用途</th>
                <th className="py-3 font-medium">是否必需</th>
              </tr>
            </thead>
            <tbody>
              {COLLECTED.map((row) => (
                <tr key={row.item} className="border-b border-line align-top">
                  <td className="py-3 pr-4 font-medium whitespace-nowrap">
                    {row.item}
                  </td>
                  <td className="py-3 pr-4 leading-6 text-muted">
                    {row.detail}
                  </td>
                  <td className="py-3 pr-4 leading-6 text-muted">
                    {row.purpose}
                  </td>
                  <td className="py-3 whitespace-nowrap text-muted">
                    {row.required}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          2. 我们不收集哪些信息
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">
          {NOT_COLLECTED.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-7">
          唯一的网络权限是 <code className="font-mono text-[13px]">android.permission.INTERNET</code>
          （用于上传成绩和读取榜单）。App 不接入任何第三方统计、崩溃上报或广告 SDK。
          另外，公开的榜单视图<strong>刻意不输出设备标识</strong>，
          所以你可以在网页上看到昵称和机型，但看不到那串 UUID。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          3. 数据存放在哪里
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">
          <li>
            上传的成绩、昵称、机型保存在{" "}
            <strong>Supabase</strong>（一个托管式 Postgres 后端服务）的数据库中，
            项目部署在<strong>韩国首尔区域</strong>。
          </li>
          <li>
            网页榜单直接读取同一个数据库的只读视图，数据由数据库的行级权限（RLS）保护：
            匿名访问只能读榜单、只能追加自己的成绩，无法修改或删除他人的数据。
          </li>
          <li>
            加速度原始波形、调参设置、音乐盒配置等只保存在你的手机本地，不会上传。
          </li>
          <li>
            榜单是<strong>公开</strong>的：任何人访问本站都能看到你的昵称、机型和成绩。
            请在起昵称时避免填入真实姓名或其他个人信息。
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          4. 数据的保留与删除
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">
          <li>
            <strong>重置身份：</strong>清除应用数据即会删除本机保存的设备标识与昵称。
            下次启动时 App 会生成一个全新的随机 UUID，对你来说就相当于一个全新身份。
            操作方式：Android 设置 → 应用 → HelloJump → 存储 → 清除数据；
            或者直接卸载应用。
            <Todo>确认是否已在 App 内提供「清除数据 / 重置身份」入口，若有请补上具体路径</Todo>
          </li>
          <li>
            <strong>删除云端成绩：</strong>由于没有账号体系，我们无法仅凭昵称确认某条成绩属于谁。
            需要删除时请通过下方联系方式说明要删除的昵称与大致时间，我们会处理。
            <Todo>补充联系邮箱与承诺的处理时限</Todo>
          </li>
          <li>
            <strong>保留期限：</strong>成绩数据在服务运行期间长期保留，直到你提出删除请求。
            <Todo>确认是否需要定期清理长期不活跃的数据</Todo>
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          5. 未成年人
        </h2>
        <p className="mt-3 text-sm leading-7">
          App 面向普通用户，不针对儿童设计，也不会主动收集儿童的任何身份信息。
          由于本应用不收集姓名、年龄等可识别信息，我们无法判断使用者年龄；
          若监护人认为需要删除相关数据，可通过下方方式联系我们。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          6. 安全
        </h2>
        <p className="mt-3 text-sm leading-7">
          传输过程使用 HTTPS 加密。数据库访问使用公开的匿名密钥，
          真正的访问控制由数据库端行级权限（RLS）完成 —— 也就是说，
          即使有人拿到这把公开密钥，他也只能读榜单、只能追加成绩，无法越权访问。
          但请注意：<strong>没有任何系统是绝对安全的</strong>，请勿上传你不想公开的内容。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          7. 政策变更
        </h2>
        <p className="mt-3 text-sm leading-7">
          本政策如有修改，会在本页面更新并同步通过
          <Link href="/announcements" className="text-brand hover:underline">
            公告页
          </Link>
          告知。继续使用即视为接受修改后的版本。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          8. 联系我们
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">
          <li>
            运营者 / 开发者：<Todo>填写实际主体名称（个人或公司）</Todo>
          </li>
          <li>
            联系邮箱：<Todo>填写可用的联系邮箱</Todo>
          </li>
        </ul>
      </section>

      <nav className="mt-12 flex flex-wrap gap-3 border-t border-line pt-8">
        <Link href="/terms" className="btn-secondary">
          用户协议
        </Link>
        <Link href="/" className="btn-secondary">
          回到首页
        </Link>
      </nav>
    </div>
  );
}
