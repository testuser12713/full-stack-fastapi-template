import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Search, X } from "lucide-react"
import { Suspense, useState } from "react"

import { ItemsService } from "@/client"
import { DataTable } from "@/components/Common/DataTable"
import AddItem from "@/components/Items/AddItem"
import { columns } from "@/components/Items/columns"
import PendingItems from "@/components/Pending/PendingItems"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ITEM_PRIORITIES,
  type ItemPriorityValue,
  type PriorityFilter,
} from "@/lib/itemPriority"
import { cn } from "@/lib/utils"

function getItemsQueryOptions(filter: PriorityFilter) {
  return {
    queryFn: async () =>
      (
        await ItemsService.readItems({
          query: {
            skip: 0,
            limit: 100,
            ...(filter === "all" ? {} : { priority: filter }),
          },
        })
      ).data,
    queryKey: ["items", filter],
  }
}

export const Route = createFileRoute("/_layout/items")({
  component: Items,
  head: () => ({
    meta: [
      {
        title: "Items - FastAPI Template",
      },
    ],
  }),
})

const PRIORITY_DOT: Record<ItemPriorityValue, string> = {
  low: "bg-[#1d4ed8] dark:bg-[#93c5fd]",
  medium: "bg-[#b45309] dark:bg-[#fcd34d]",
  high: "bg-[#b91c1c] dark:bg-[#fca5a5]",
}

function PriorityDot({ priority }: { priority: ItemPriorityValue }) {
  return (
    <span
      className={cn("size-1.5 rounded-full", PRIORITY_DOT[priority])}
      aria-hidden="true"
    />
  )
}

function PriorityFilterControl({
  value,
  onChange,
}: {
  value: PriorityFilter
  onChange: (value: PriorityFilter) => void
}) {
  return (
    <div className="flex w-full items-end gap-2 sm:w-auto">
      <div className="flex w-full flex-col gap-2 sm:w-[180px]">
        <Label
          htmlFor="priority-filter"
          className="text-xs font-medium text-muted-foreground"
        >
          Priority
        </Label>
        <Select
          value={value}
          onValueChange={(next) => onChange(next as PriorityFilter)}
        >
          <SelectTrigger id="priority-filter" className="h-11 w-full md:h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {ITEM_PRIORITIES.map((priority) => (
              <SelectItem key={priority} value={priority}>
                <PriorityDot priority={priority} />
                <span>{priority}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {value !== "all" && (
        <Button
          variant="ghost"
          size="icon"
          className="size-11 shrink-0"
          aria-label="Clear filter"
          onClick={() => onChange("all")}
        >
          <X />
        </Button>
      )}
    </div>
  )
}

function ItemsTableContent({
  filter,
  onClear,
}: {
  filter: PriorityFilter
  onClear: () => void
}) {
  const { data: items } = useSuspenseQuery(getItemsQueryOptions(filter))
  const count = items.data.length
  const summary = `${count} ${count === 1 ? "item" : "items"}${
    filter === "all" ? "" : ` · priority ${filter}`
  }`

  if (count === 0) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{summary}</p>
        {filter === "all" ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">
              You don't have any items yet
            </h3>
            <p className="text-muted-foreground">
              Add a new item to get started
            </p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-[360px] flex-col items-center justify-center gap-2 px-4 py-12 text-center">
            <Search className="h-6 w-6 text-muted-foreground" />
            <h3 className="text-lg font-semibold">
              No items with priority "{filter}"
            </h3>
            <p className="text-muted-foreground">
              Nothing matches the selected priority filter.
            </p>
            <Button variant="outline" className="mt-2" onClick={onClear}>
              Clear filter
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{summary}</p>
      <DataTable columns={columns} data={items.data} />
    </div>
  )
}

function ItemsTable() {
  const [filter, setFilter] = useState<PriorityFilter>("all")

  return (
    <div className="flex flex-col gap-4">
      <PriorityFilterControl value={filter} onChange={setFilter} />
      <Suspense fallback={<PendingItems />}>
        <ItemsTableContent filter={filter} onClear={() => setFilter("all")} />
      </Suspense>
    </div>
  )
}

function Items() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Items</h1>
          <p className="text-muted-foreground">Create and manage your items</p>
        </div>
        <AddItem />
      </div>
      <ItemsTable />
    </div>
  )
}
