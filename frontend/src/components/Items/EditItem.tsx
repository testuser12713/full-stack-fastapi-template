import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { type ItemPublic, ItemsService } from "@/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoadingButton } from "@/components/ui/loading-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useCustomToast from "@/hooks/useCustomToast"
import { ITEM_PRIORITIES, type ItemPriorityValue } from "@/lib/itemPriority"
import { cn } from "@/lib/utils"
import { handleError } from "@/utils"

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  priority: z.enum(ITEM_PRIORITIES),
})

type FormData = z.infer<typeof formSchema>

const priorityDotClass: Record<ItemPriorityValue, string> = {
  low: "bg-[#1d4ed8] dark:bg-[#93c5fd]",
  medium: "bg-[#b45309] dark:bg-[#fcd34d]",
  high: "bg-[#b91c1c] dark:bg-[#fca5a5]",
}

interface EditItemProps {
  item: ItemPublic
  onSuccess: () => void
}

interface ItemDialogFooterProps {
  pending: boolean
}

const ItemDialogFooter = ({ pending }: ItemDialogFooterProps) => (
  <DialogFooter>
    <DialogClose asChild>
      <Button variant="outline" disabled={pending}>
        Cancel
      </Button>
    </DialogClose>
    <LoadingButton type="submit" loading={pending}>
      Save
    </LoadingButton>
  </DialogFooter>
)

const EditItem = ({ item, onSuccess }: EditItemProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      title: item.title,
      description: item.description ?? undefined,
      priority: item.priority ?? "medium",
    },
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      ItemsService.updateItem({ path: { id: item.id }, body: data }),
    onSuccess: () => {
      showSuccessToast("Item updated successfully")
      setIsOpen(false)
      onSuccess()
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      form.reset({
        title: item.title,
        description: item.description ?? undefined,
        priority: item.priority ?? "medium",
      })
    }
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        onClick={() => handleOpenChange(true)}
      >
        <Pencil />
        Edit Item
      </DropdownMenuItem>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>
                Update the item details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Title <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Title" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Description" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">
                      Priority
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={mutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="w-full bg-card max-md:min-h-11 focus-visible:ring-2 focus-visible:ring-[#a1a1a1]"
                          onBlur={field.onBlur}
                        >
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ITEM_PRIORITIES.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            <span
                              aria-hidden="true"
                              className={cn(
                                "size-1.5 rounded-full",
                                priorityDotClass[priority],
                              )}
                            />
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <ItemDialogFooter pending={mutation.isPending} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditItem
