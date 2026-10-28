import type { ItemPublic } from "@/client"

export type ItemPriorityValue = NonNullable<ItemPublic["priority"]>

export const ITEM_PRIORITIES = [
  "low",
  "medium",
  "high",
] as const satisfies readonly ItemPriorityValue[]

type UnlistedPriority = Exclude<
  ItemPriorityValue,
  (typeof ITEM_PRIORITIES)[number]
>

type AssertNever<T extends never> = T

export type PriorityFilter =
  | ItemPriorityValue
  | "all"
  | AssertNever<UnlistedPriority>
