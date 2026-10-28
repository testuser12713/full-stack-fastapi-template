import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import ErrorComponent from "@/components/Common/ErrorComponent"
import NotFound from "@/components/Common/NotFound"

function PrivacyFooter() {
  return (
    <footer className="border-t px-4 py-2">
      <div className="mx-auto flex max-w-7xl justify-center">
        <Link
          to="/privacy"
          className="inline-flex min-h-11 items-center rounded-sm px-2 text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-muted-foreground dark:hover:text-foreground"
        >
          Privacy policy
        </Link>
      </div>
    </footer>
  )
}

export const Route = createRootRoute({
  component: () => (
    <>
      <HeadContent />
      <Outlet />
      <PrivacyFooter />
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  ),
  notFoundComponent: () => <NotFound />,
  errorComponent: () => <ErrorComponent />,
})
