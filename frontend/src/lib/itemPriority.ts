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
