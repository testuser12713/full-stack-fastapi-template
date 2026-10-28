import type { ItemPriorityValue } from "@/lib/itemPriority"
import { cn } from "@/lib/utils"

const priorityStyles: Record<ItemPriorityValue, string> = {
  low: "border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8] dark:border-[#1e40af] dark:bg-[#172554] dark:text-[#93c5fd]",
  medium:
    "border-[#fde68a] bg-[#fffbeb] text-[#b45309] dark:border-[#92400e] dark:bg-[#451a03] dark:text-[#fcd34d]",
  high: "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c] dark:border-[#991b1b] dark:bg-[#450a0a] dark:text-[#fca5a5]",
}

const neutralStyle = "border-border bg-muted text-muted-foreground"

export function PriorityBadge({ priority }: { priority: ItemPriorityValue }) {
  const isKnown = priority in priorityStyles
  const label = isKnown ? priority : "unknown"

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium leading-4 whitespace-nowrap",
        isKnown ? priorityStyles[priority] : neutralStyle,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}
