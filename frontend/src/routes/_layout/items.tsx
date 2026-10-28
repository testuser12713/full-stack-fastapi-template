import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Filter, Search } from "lucide-react"
import { Suspense, useState } from "react"

import { ItemsService } from "@/client"
import { DataTable } from "@/components/Common/DataTable"
import AddItem from "@/components/Items/AddItem"
import { columns } from "@/components/Items/columns"
import PendingItems from "@/components/Pending/PendingItems"
import { Button } from "@/components/ui/button"
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
  priorityLabel,
} from "@/lib/itemPriority"
import { cn } from "@/lib/utils"

type PriorityFilter = "all" | ItemPriorityValue

const DOT_CLASSNAMES = [
  "bg-[#525252] dark:bg-[#d4d4d4]",
  "bg-[#92400e] dark:bg-[#fcd34d]",
  "bg-[#b91c1c] dark:bg-[#fca5a5]",
] as const

const ICON_CLASSNAMES = [
  "text-[#525252] dark:text-[#d4d4d4]",
  "text-[#92400e] dark:text-[#fcd34d]",
  "text-[#b91c1c] dark:text-[#fca5a5]",
] as const

function getItemsQueryOptions(priority: PriorityFilter) {
  return {
    queryFn: async () =>
      (
        await ItemsService.readItems({
          query: {
            skip: 0,
            limit: 100,
            ...(priority === "all" ? {} : { priority }),
          },
        })
      ).data,
    queryKey: ["items", priority],
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

function PriorityFilterSelect({
  value,
  onChange,
}: {
  value: PriorityFilter
  onChange: (value: PriorityFilter) => void
}) {
  const activeIndex = ITEM_PRIORITIES.findIndex(
    (priority) => priority.value === value,
  )

  return (
    <Select
      value={value}
      onValueChange={(nextValue) => onChange(nextValue as PriorityFilter)}
    >
      <SelectTrigger
        aria-label="Filter by priority"
        className={cn(
          "h-9 min-w-[180px] border-[#d4d4d4] bg-white text-sm focus-visible:border-[#a1a1a1] focus-visible:ring-2 focus-visible:ring-[#a1a1a1] focus-visible:ring-offset-2 max-md:h-11 max-md:w-full dark:border-input dark:bg-input/30",
          value !== "all" && "font-medium",
        )}
      >
        <Filter
          className={cn(
            "size-4",
            activeIndex >= 0
              ? ICON_CLASSNAMES[activeIndex]
              : "text-[#737373] dark:text-muted-foreground",
          )}
        />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All priorities</SelectItem>
        {ITEM_PRIORITIES.map((priority, index) =>
          priority.value ? (
            <SelectItem key={priority.value} value={priority.value}>
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  DOT_CLASSNAMES[index],
                )}
              />
              {priority.label}
            </SelectItem>
          ) : null,
        )}
      </SelectContent>
    </Select>
  )
}

function ItemsTableContent({
  priority,
  onClearFilter,
}: {
  priority: PriorityFilter
  onClearFilter: () => void
}) {
  const { data: items } = useSuspenseQuery(getItemsQueryOptions(priority))

  if (items.data.length === 0) {
    if (priority !== "all") {
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <Search className="h-8 w-8 text-muted-foreground" />
          <h3 className="text-lg font-semibold">
            No items with priority {priorityLabel(priority)}
          </h3>
          <p className="text-muted-foreground">
            Try a different priority or show all items.
          </p>
          <Button variant="ghost" onClick={onClearFilter}>
            Clear filter
          </Button>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">You don't have any items yet</h3>
        <p className="text-muted-foreground">Add a new item to get started</p>
      </div>
    )
  }

  return <DataTable key={priority} columns={columns} data={items.data} />
}

function ItemsTable({
  priority,
  onClearFilter,
}: {
  priority: PriorityFilter
  onClearFilter: () => void
}) {
  return (
    <Suspense fallback={<PendingItems />}>
      <ItemsTableContent priority={priority} onClearFilter={onClearFilter} />
    </Suspense>
  )
}

function Items() {
  const [priority, setPriority] = useState<PriorityFilter>("all")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Items
            {priority !== "all" && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                · {priorityLabel(priority)}
              </span>
            )}
          </h1>
          <p className="text-muted-foreground">Create and manage your items</p>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <PriorityFilterSelect value={priority} onChange={setPriority} />
          <AddItem />
        </div>
      </div>
      <ItemsTable
        priority={priority}
        onClearFilter={() => setPriority("all")}
      />
    </div>
  )
}
