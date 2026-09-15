/** 草稿里需要发布前核实的点，用统一醒目的行内标记。 */
export default function Todo({ children }: { children: React.ReactNode }) {
  return (
    <mark className="rounded bg-amber-100 px-1.5 py-0.5 text-[13px] font-medium text-amber-900">
      【待确认：{children}】
    </mark>
  );
}
