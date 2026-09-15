import type { Metadata } from "next";
import Link from "next/link";
import DraftBanner from "@/components/DraftBanner";
import Todo from "@/components/Todo";

export const metadata: Metadata = {
  title: "用户协议",
  description:
    "HelloJump 抛手机测高的用户协议草稿：服务说明、抛掷风险提示、行为规范、成绩数据性质与免责声明。",
};

export default function TermsPage() {
  return (
    <div className="shell max-w-3xl py-14 md:py-20">
      <header>
        <p className="text-sm font-medium text-brand">法律条款</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          用户协议
        </h1>
        <p className="mt-4 leading-relaxed text-muted">
          使用 HelloJump（抛手机测高）即表示你已阅读并同意以下条款。
          如果不同意，请不要使用本应用。
        </p>
      </header>

      <div className="mt-8">
        <DraftBanner what="用户协议" />
      </div>

      <div className="mt-8 space-y-2 text-sm text-muted">
        <p>适用应用：HelloJump（抛手机测高）Android 版</p>
        <p>
          生效日期：<Todo>填入正式生效日期</Todo>　最近更新：
          <Todo>填入更新日期</Todo>
        </p>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          1. 服务说明
        </h2>
        <p className="mt-3 text-sm leading-7">
          HelloJump 是一个利用手机加速度计测量抛掷高度的娱乐性应用。
          它读取手机在空中自由落体期间的失重时长 Δt，并按 h = g·Δt²/8
          换算出高度，同时提供本机记录与公开的全球排行榜。
        </p>
        <p className="mt-3 text-sm leading-7">
          本应用为个人项目，免费提供，<strong>不保证服务的持续可用性</strong>。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          2. 使用前提与安全提示（请务必阅读）
        </h2>
        <div className="mt-4 rounded-2xl border-2 border-red-200 bg-red-50 p-5 text-sm leading-7 text-red-900">
          <p className="font-semibold">
            ⚠️ 抛掷手机存在手机损坏、跌落伤人的风险。
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>请在柔软的表面上进行（草地、厚地毯、床铺），并取下保护壳以外的易脱落配件。</li>
            <li>确认头顶没有吊灯、风扇等障碍物，周围没有人，尤其是儿童。</li>
            <li>不要在楼梯、阳台、水边、马路等环境尝试。</li>
            <li>量力而行：不要为了冲榜而用力过猛。测高只是娱乐，不是竞技体育。</li>
            <li>
              <strong>因使用本应用导致的手机损坏、人身伤害或财产损失，由使用者自行承担。</strong>
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          3. 成绩数据的性质
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">
          <li>
            成绩由手机传感器估算得出，<strong>存在误差</strong>，受设备型号、采样率、
            判定阈值和抛掷姿态影响。它<strong>不是计量工具</strong>，
            不能用于任何需要精确高度的场合。
          </li>
          <li>
            你会被要求为成绩创建一个昵称。根据隐私政策中说明的机制，
            你的成绩会以「昵称 + 机型 + 高度」的形式出现在公开榜单上。
          </li>
          <li>
            我们会删除明显异常或伪造的成绩，并保留在不事先通知的情况下调整榜单展示方式的权利。
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          4. 用户行为规范
        </h2>
        <p className="mt-3 text-sm leading-7">
          由于榜单公开可见，你设置昵称时不得使用：
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">
          <li>违法、暴力、色情、歧视、侮辱或引战的内容；</li>
          <li>他人的真实姓名、联系方式等个人信息；</li>
          <li>冒充他人或官方的名称；</li>
          <li>广告、推广链接或垃圾信息。</li>
        </ul>
        <p className="mt-4 text-sm leading-7">
          违反上述规范的昵称与成绩可能被清除；如情节严重，我们将限制相关设备的提交。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          5. 知识产权
        </h2>
        <p className="mt-3 text-sm leading-7">
          应用本体、代码、界面设计、文案、音频素材及本站内容的知识产权归开发者或相应权利人所有。
          未经许可，不得复制、修改、分发或用于商业用途。
          <Todo>确认名称「HelloJump」与音频素材的来源与授权状态，必要时补充第三方素材声明</Todo>
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          6. 服务变更、中断与终止
        </h2>
        <p className="mt-3 text-sm leading-7">
          我们可能随时新增、修改或停止部分功能，也可能因维护、后端故障或不可抗力导致服务中断。
          榜单数据在服务停止时可能无法保留，请勿将其用作长期存储。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          7. 免责声明
        </h2>
        <p className="mt-3 text-sm leading-7">
          本应用按「现状」提供，不对适销性、特定用途适用性或结果准确性作出任何明示或默示的保证。
          在法律允许的最大范围内，开发者不对因使用或无法使用本应用而产生的任何间接、
          附带或后果性损失承担责任。
          <Todo>确认免责条款在目标发布地区是否有效，必要时按当地法律调整</Todo>
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          8. 协议变更
        </h2>
        <p className="mt-3 text-sm leading-7">
          本协议如有修改，会在本页面更新并通过
          <Link href="/announcements" className="text-brand hover:underline">
            公告页
          </Link>
          告知。继续使用即视为接受修改后的版本。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          9. 适用法律与争议解决
        </h2>
        <p className="mt-3 text-sm leading-7">
          <Todo>填写适用法律与争议解决地（例如「适用中华人民共和国法律，争议提交 XX 地有管辖权的法院」）</Todo>
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">
          10. 联系我们
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
        <Link href="/privacy" className="btn-secondary">
          隐私政策
        </Link>
        <Link href="/" className="btn-secondary">
          回到首页
        </Link>
      </nav>
    </div>
  );
}
