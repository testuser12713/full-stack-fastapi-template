import { createFileRoute, Link } from "@tanstack/react-router"
import { TriangleAlert } from "lucide-react"
import type { ReactNode } from "react"

import AppSidebar from "@/components/Sidebar/AppSidebar"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const Route = createFileRoute("/privacy")({
  component: PrivacyPolicy,
  head: () => ({
    meta: [
      {
        title: "Privacy policy - FastAPI Template",
      },
    ],
  }),
})

const privacyLinkClass =
  "inline-flex min-h-11 items-center rounded-sm px-1 text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-muted-foreground dark:hover:text-foreground"

const tocItems = [
  { href: "#controller", label: "Controller" },
  { href: "#processing", label: "Processing activities" },
  { href: "#recipients", label: "Recipients" },
  { href: "#rights", label: "Your rights" },
  { href: "#complaint", label: "Right to complain" },
]

function LegalSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-2">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="flex flex-col gap-4 text-sm text-[#525252] dark:text-[#d4d4d4]">
        {children}
      </div>
    </section>
  )
}

function NoticeBox({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-[#fcd34d] bg-[#fffbeb] px-4 py-3 text-sm text-[#78350f]">
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p className="max-w-[72ch]">
        <span className="font-semibold">[By the operator to complete]</span>{" "}
        {children}
      </p>
    </div>
  )
}

function PrivacyPolicy() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1 text-muted-foreground" />
        </header>
        <main className="min-w-0 flex-1 p-4 md:p-8">
          <div className="mx-auto flex w-full min-w-0 max-w-[720px] flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-foreground">
                  Privacy policy
                </h1>
                <p className="text-sm text-muted-foreground">
                  Stand: 12 Mar 2025
                </p>
              </div>
              <nav
                aria-label="Table of contents"
                className="flex flex-wrap gap-x-4 gap-y-1 text-sm"
              >
                {tocItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <LegalSection id="controller" title="Controller">
              <p className="max-w-[72ch]">
                The controller within the meaning of the General Data Protection
                Regulation (GDPR) is the operator of this application. The
                operator decides how and why your personal data is processed and
                is responsible for answering your questions about data
                protection.
              </p>
              <NoticeBox>
                Name, postal address and contact details (including an email
                address and, if appointed, the contact details of a data
                protection officer) of the controller.
              </NoticeBox>
            </LegalSection>

            <LegalSection id="processing" title="Processing activities">
              <p className="max-w-[72ch]">
                The following table lists every processing of personal data that
                actually takes place when you use this application.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Legal basis</TableHead>
                    <TableHead>Storage duration</TableHead>
                    <TableHead>Recipients</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="whitespace-normal align-top">
                      <span className="font-medium text-foreground">
                        Registration
                      </span>
                      <br />
                      Creating and managing your account, including your full
                      name, email address, password (stored only as a hash) and
                      the items you create.
                    </TableCell>
                    <TableCell className="whitespace-normal align-top">
                      Art. 6(1)(b) GDPR — performance of a contract or steps
                      taken prior to entering into a contract.
                    </TableCell>
                    <TableCell className="whitespace-normal align-top">
                      Until you delete your account. You can delete your account
                      at any time under Settings.
                    </TableCell>
                    <TableCell className="whitespace-normal align-top">
                      Hosting provider (see the note below). No other
                      recipients.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-normal align-top">
                      <span className="font-medium text-foreground">Login</span>
                      <br />
                      Authenticating you, verifying your credentials and keeping
                      your session active.
                    </TableCell>
                    <TableCell className="whitespace-normal align-top">
                      Art. 6(1)(b) GDPR — performance of a contract or steps
                      taken prior to entering into a contract.
                    </TableCell>
                    <TableCell className="whitespace-normal align-top">
                      The access token remains in your browser until you log
                      out. Authentication events are stored for as long as your
                      account exists.
                    </TableCell>
                    <TableCell className="whitespace-normal align-top">
                      Hosting provider (see the note below). No other
                      recipients.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="whitespace-normal align-top">
                      <span className="font-medium text-foreground">
                        Server logs
                      </span>
                      <br />
                      Operating the service securely, troubleshooting errors,
                      and detecting and preventing abuse.
                    </TableCell>
                    <TableCell className="whitespace-normal align-top">
                      Art. 6(1)(f) GDPR — legitimate interests in a secure and
                      stable service.
                    </TableCell>
                    <TableCell className="whitespace-normal align-top">
                      See the note below.
                    </TableCell>
                    <TableCell className="whitespace-normal align-top">
                      Hosting provider (see the note below). No other
                      recipients.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <NoticeBox>
                Retention period for server logs. Define how long server logs
                are kept before they are deleted or anonymised.
              </NoticeBox>
              <NoticeBox>
                Name and address of the hosting provider that processes data on
                behalf of the operator.
              </NoticeBox>
            </LegalSection>

            <LegalSection
              id="recipients"
              title="Recipients and third-country transfers"
            >
              <p className="max-w-[72ch]">
                Your personal data is not sold. It is disclosed only to the
                hosting provider that operates this application and, where
                required by law, to public authorities. No other recipients are
                involved.
              </p>
              <NoticeBox>
                Name of the hosting provider and any other processors, and
                whether personal data is transferred to a third country (outside
                the European Economic Area) together with the safeguards relied
                on for that transfer (for example an adequacy decision or
                standard contractual clauses).
              </NoticeBox>
            </LegalSection>

            <LegalSection id="rights" title="Your rights">
              <p className="max-w-[72ch]">
                Under the GDPR you have the following rights regarding your
                personal data:
              </p>
              <ul className="max-w-[72ch] list-disc space-y-1 pl-5">
                <li>Right of access (Art. 15 GDPR).</li>
                <li>Right to rectification (Art. 16 GDPR).</li>
                <li>Right to erasure (Art. 17 GDPR).</li>
                <li>Right to restriction of processing (Art. 18 GDPR).</li>
                <li>Right to data portability (Art. 20 GDPR).</li>
                <li>Right to object (Art. 21 GDPR).</li>
              </ul>
              <p className="max-w-[72ch]">
                To exercise any of these rights, contact the controller using
                the details above. You can delete your account and the data
                stored with it at any time under Settings.
              </p>
            </LegalSection>

            <LegalSection id="complaint" title="Right to complain">
              <p className="max-w-[72ch]">
                If you believe that the processing of your personal data
                infringes the GDPR, you have the right to lodge a complaint with
                a supervisory authority, in particular in the Member State of
                your habitual residence, place of work or place of the alleged
                infringement.
              </p>
              <NoticeBox>
                Name and contact details of the supervisory authority
                responsible for the controller.
              </NoticeBox>
            </LegalSection>

            <footer className="mt-8 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link to="/privacy" className={privacyLinkClass}>
                Privacy policy
              </Link>
              <Button asChild variant="outline">
                <Link to="/items">Back to items</Link>
              </Button>
            </footer>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
