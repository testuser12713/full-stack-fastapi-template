import type { ColumnDef } from "@tanstack/react-table"
import { Check, Copy } from "lucide-react"

import type { ItemPublic } from "@/client"
import type { DataTableFeatures } from "@/components/Common/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import { priorityLabel } from "@/lib/itemPriority"
import { cn } from "@/lib/utils"
import { ItemActionsMenu } from "./ItemActionsMenu"

function CopyId({ id }: { id: string }) {
  const [copiedText, copy] = useCopyToClipboard()
  const isCopied = copiedText === id

  return (
    <div className="flex items-center gap-1.5 group">
      <span className="font-mono text-xs text-muted-foreground">{id}</span>
      <Button
        variant="ghost"
        size="icon"
        className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => copy(id)}
      >
        {isCopied ? (
          <Check className="size-3 text-green-500" />
        ) : (
          <Copy className="size-3" />
        )}
        <span className="sr-only">Copy ID</span>
      </Button>
    </div>
  )
}

const PRIORITY_BADGE_BASE =
  "inline-flex h-[22px] items-center gap-[6px] rounded-md border px-2 py-[2px] text-[13px] font-semibold"

const PRIORITY_BADGE_COLORS: Record<string, string> = {
  Low: "bg-[#f5f5f5] text-[#525252] border-[#e5e5e5] dark:bg-[#262626] dark:text-[#d4d4d4] dark:border-[#262626]",
  Medium:
    "bg-[#fef3c7] text-[#92400e] border-[#fde68a] dark:bg-[#451a03] dark:text-[#fcd34d] dark:border-[#451a03]",
  High: "bg-[#fee2e2] text-[#b91c1c] border-[#fecaca] dark:bg-[#450a0a] dark:text-[#fca5a5] dark:border-[#450a0a]",
}

function PriorityBadge({ priority }: { priority: ItemPublic["priority"] }) {
  const label = priorityLabel(priority)

  return (
    <Badge
      variant="outline"
      className={cn(
        PRIORITY_BADGE_BASE,
        PRIORITY_BADGE_COLORS[label] ?? PRIORITY_BADGE_COLORS.Medium,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </Badge>
  )
}

export const columns: ColumnDef<DataTableFeatures, ItemPublic>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <CopyId id={row.original.id} />,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.original.description
      return (
        <span
          className={cn(
            "max-w-xs truncate block text-muted-foreground",
            !description && "italic",
          )}
        >
          {description || "No description"}
        </span>
      )
    },
  },
  {
    accessorKey: "priority",
    header: () => <div className="text-right">Priority</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <PriorityBadge priority={row.original.priority} />
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <ItemActionsMenu item={row.original} />
      </div>
    ),
  },
]
