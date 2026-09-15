/** 草稿提示条：隐私政策 / 用户协议在用，醒目但不刺眼。 */
export default function DraftBanner({ what }: { what: string }) {
  return (
    <div
      role="note"
      className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-5"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-400 text-base leading-none text-amber-950">
          !
        </span>
        <div>
          <p className="text-sm font-semibold text-amber-950">
            草稿：发布前需根据实际情况确认
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-amber-900">
            本{what}为初稿，用于占位与内部评审，<strong>尚未生效</strong>。
            正式发布前请逐条核对：实际收集的数据项、第三方服务的地区与条款、
            运营主体名称与联系方式、适用法律与争议解决地、生效日期。
            核对完成后再移除本条提示。
          </p>
        </div>
      </div>
    </div>
  );
}
