import type { ItemPublic } from "@/client"

export type ItemPriorityValue = NonNullable<ItemPublic["priority"]>

const PRIORITY_LABELS: Record<ItemPriorityValue, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

export const ITEM_PRIORITIES: readonly {
  value: ItemPublic["priority"]
  label: string
}[] = [
  { value: "low", label: PRIORITY_LABELS.low },
  { value: "medium", label: PRIORITY_LABELS.medium },
  { value: "high", label: PRIORITY_LABELS.high },
]

function assertNever(value: never): never {
  throw new Error(`Unhandled item priority: ${String(value)}`)
}

export function priorityLabel(value: ItemPublic["priority"]): string {
  switch (value) {
    case undefined:
      return PRIORITY_LABELS.medium
    case "low":
      return PRIORITY_LABELS.low
    case "medium":
      return PRIORITY_LABELS.medium
    case "high":
      return PRIORITY_LABELS.high
    default:
      return assertNever(value)
  }
}

export const DEFAULT_ITEM_PRIORITY: ItemPriorityValue = "medium"

const PRIORITY_DOT_CLASSES: Record<ItemPriorityValue, string> = {
  low: "bg-[#525252] dark:bg-[#d4d4d4]",
  medium: "bg-[#92400e] dark:bg-[#fcd34d]",
  high: "bg-[#b91c1c] dark:bg-[#fca5a5]",
}

export function priorityDotClass(value: ItemPriorityValue): string {
  return PRIORITY_DOT_CLASSES[value]
}
