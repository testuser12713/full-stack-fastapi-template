import { Link } from "@tanstack/react-router"

import { cn } from "@/lib/utils"

export function PrivacyLink({ className }: { className?: string }) {
  return (
    <Link
      to="/privacy"
      className={cn(
        "inline-flex min-h-11 items-center rounded-sm text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      Privacy policy
    </Link>
  )
}
