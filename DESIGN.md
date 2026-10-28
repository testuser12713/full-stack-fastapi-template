# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Continuation of the existing Full Stack FastAPI Template look: shadcn/ui neutral greyscale UI in Inter with a near-black primary, extended only by a three-step, colour-coded priority badge (blue / amber / red) that reads at a glance in both light and dark mode.

## Colors

- `--color-bg`: **#ffffff**
- `--color-fg`: **#0a0a0a**
- `--color-card`: **#ffffff**
- `--color-card_fg`: **#0a0a0a**
- `--color-popover`: **#ffffff**
- `--color-muted`: **#f5f5f5**
- `--color-muted_fg`: **#737373**
- `--color-border`: **#e5e5e5**
- `--color-input`: **#e5e5e5**
- `--color-accent`: **#171717**
- `--color-accent_fg`: **#fafafa**
- `--color-secondary`: **#f5f5f5**
- `--color-ring`: **#a1a1a1**
- `--color-destructive`: **#e7000b**
- `--color-dark_bg`: **#0a0a0a**
- `--color-dark_fg`: **#fafafa**
- `--color-dark_card`: **#171717**
- `--color-dark_muted`: **#262626**
- `--color-dark_muted_fg`: **#a1a1a1**
- `--color-dark_border`: **#2e2e2e**
- `--color-dark_accent`: **#e5e5e5**
- `--color-dark_accent_fg`: **#171717**
- `--color-priority_low_bg`: **#eff6ff**
- `--color-priority_low_fg`: **#1d4ed8**
- `--color-priority_low_border`: **#bfdbfe**
- `--color-priority_medium_bg`: **#fffbeb**
- `--color-priority_medium_fg`: **#b45309**
- `--color-priority_medium_border`: **#fde68a**
- `--color-priority_high_bg`: **#fef2f2**
- `--color-priority_high_fg`: **#b91c1c**
- `--color-priority_high_border`: **#fecaca**
- `--color-priority_low_bg_dark`: **#172554**
- `--color-priority_low_fg_dark`: **#93c5fd**
- `--color-priority_low_border_dark`: **#1e40af**
- `--color-priority_medium_bg_dark`: **#451a03**
- `--color-priority_medium_fg_dark`: **#fcd34d**
- `--color-priority_medium_border_dark`: **#92400e**
- `--color-priority_high_bg_dark`: **#450a0a**
- `--color-priority_high_fg_dark`: **#fca5a5**
- `--color-priority_high_border_dark`: **#991b1b**

## Typography

- `heading_font`: "Inter", system-ui, "Segoe UI", Roboto, Arial, sans-serif
- `font_family`: "Inter", system-ui, "Segoe UI", Roboto, Arial, sans-serif
- `heading_weight`: 600
- `body_weight`: 400
- `label_weight`: 500
- `size_h1`: 30px / 36px, weight 600, tracking -0.02em
- `size_h2`: 24px / 32px, weight 600, tracking -0.01em
- `size_card_title`: 18px / 24px, weight 600
- `size_body`: 14px / 20px, weight 400
- `size_small`: 12px / 16px, weight 400 (muted_foreground for secondary meta)
- `size_badge`: 12px / 16px, weight 500, lowercase value text
- Inter files: `design/fonts/inter/` — `font.css` holds its @font-face rules, `OFL.txt` its licence

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 12px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px
- `--space-6`: 48px

## Border-Radii

- `--radius-sm`: 6px
- `--radius-md`: 8px
- `--radius-lg`: 10px
- `--radius-xl`: 14px
- `--radius-pill`: 999px

## Components

### Button

Existing shadcn Button, unchanged variants (default = solid accent #171717 with white text; outline = border + transparent; ghost; destructive). Sizes: default h-9 px-4 text-body, sm h-8 px-3, icon size 36x36. Radius md (8px). States: default bg accent; hover bg #262626 (light) / #d4d4d4 (dark); active bg #0a0a0a + translate-y-px; focus-visible ring 2px #a1a1a1 offset 2px; disabled opacity 0.5 + pointer-events none; loading keeps width, label replaced by 16px spinner plus aria-busy. Touch: every Button, Select trigger and icon button gets min-height 44px and min-width 44px below 768px so the tap target holds on mobile. Primary actions in dialogs sit right-aligned: 'Cancel' outline, 'Save' default.

### PriorityBadge

Read-only status badge used in the items table. Rounded md (8px), border 1px, padding 2px 8px, font-size 12px/16px weight 500, text is exactly the stored value, lowercase: "low", "medium", "high" (no translation, no capitalisation) so it equals the API value. Colours light mode — low: bg #eff6ff / text #1d4ed8 / border #bfdbfe; medium: bg #fffbeb / text #b45309 / border #fde68a; high: bg #fef2f2 / text #b91c1c / border #fecaca. Dark mode — low: #172554 / #93c5fd / #1e40af; medium: #451a03 / #fcd34d / #92400e; high: #450a0a / #fca5a5 / #991b1b. The three tints differ in hue (blue / amber / red) and lightness, so they are distinguishable for colour-blind users as well; additionally each badge carries a 6px leading dot (current text colour) so it is not colour-only. Optional 8px uppercase tiny prefix ('PRIORITY') is NOT used inside the table cell. Unknown/missing value renders as muted neutral badge, never blank.

### PrioritySelect (form field)

shadcn Select used inside the Add Item and Edit Item dialogs. Label 'Priority' (12px, weight 500, muted_fg density, 8px gap to trigger). Trigger: full width of the dialog field column, h-9 (min-height 44px on touch), radius md, border #e5e5e5 (dark #2e2e2e), bg card, text 14px; placeholder never shows because a value is always set. Options in fixed order: low, medium, high — each option row shows the PriorityBadge dot + lowercase value. Options are derived from the generated ItemPriority type (single source of truth) — never a hand-written second array in the frontend. Default value: 'medium' in Add Item, the item's current priority in Edit Item. Keyboard: arrow keys move, Enter selects, Esc closes. Focus-visible ring 2px #a1a1a1. Disabled while the mutation is pending (opacity 0.5).

### PriorityFilter

Filter control above the items table. Labelled 'Priority', visually a shadcn Select, width 180px (full width on mobile), h-9 / min-height 44px on touch. Options: 'All' first (value = no filter, the default), then low, medium, high rendered with the badge dot and lowercase value. Selecting a value refetches the list with ?priority=<value>; selecting 'All' clears it. Beside it a ghost icon button 'Clear filter' (X icon, 44x44 touch target) appears only while a specific priority is active and resets to 'All'. Active state is also echoed in the results line ('3 items · priority high'). Never a free-text input.

### Filter bar / Toolbar

One row inside the top of the items Card: left = PriorityFilter, then a muted results count ('3 items'), right = 'Add Item' Button (default variant, plus icon). Paddings 16px, gap 12px, wraps on mobile so the filter takes a full row and 'Add Item' becomes a full-width button below the card title. No other controls (no search, no bulk actions) — anything not in scope does not appear.

### DataTable (Items table)

Existing TanStack-Table based DataTable, reused. Columns in this order: 'Title' (14px, weight 500, truncates with ellipsis), 'Description' (14px muted_fg, single line truncated, em dash '—' when empty), 'Priority' (PriorityBadge, column width 120px, fixed so it never scrolls out of sight), and a trailing 44px row-action column (shadcn DropdownMenu with 'Edit' and 'Delete'). Header row: 12px uppercase? no — 12px weight 500 muted_fg, bg muted, sticky on vertical scroll. Rows: 52px tall, border-bottom 1px border, hover bg muted/60, focus-visible ring inset. Below 768px the table scrolls horizontally inside the card and the Priority column stays pinned right. Footer: 'Page 1 of 1', rows-per-page select (10/20/30/40/50) and '0 of 0 row(s) selected' only if row selection exists — otherwise the selection text is omitted, nothing dead is rendered.

### EmptyState

Two distinct variants inside the table area, centered, padding 48px, max-width 360px: (a) no data at all — heading 'No items yet', body 'Create your first item to get started.', primary Button 'Add Item'; (b) no match for the filter — should read 'No items with priority "high"', body 'Nothing matches the selected priority filter.', outline Button 'Clear filter' that resets the filter to 'All'. Variant (b) replaces (a) whenever a priority filter is active, per AC-09. Icon: 24px outline, muted_fg. Never a blank white area.

### ItemDialog (Add Item / Edit Item)

Existing shadcn Dialog, reused; Add Item and Edit Item share the form. Width 425px (max-w-md), radius lg (10px), padding 24px, overlay black/50. Header: title 'Add Item' / 'Edit Item', short muted description. Body fields stacked with 16px gap: 'Title' Input (required, max 255), 'Description' textarea/Input optional, 'Priority' PrioritySelect (default medium / current value). react-hook-form + zod; invalid field shows 12px destructive text under the field and a destructive border on the control. Footer: 'Cancel' (outline) and 'Save' (default, label 'Add Item' in create mode) right-aligned with 8px gap; Save enters loading state while pending, both are disabled during submit. Esc / overlay click closes unless a mutation is in flight. On success: dialog closes, list refetches (query invalidation — no manual reload), success toast 'Item created' / 'Item updated'.

### Toast

Existing Sonner toaster, bottom-right, 360px, radius md, border 1px, bg card. Success: 'Item created', 'Item updated', 'Item deleted'. Error: 'Couldn't save the item. Please try again.' with the API's field message when present (never a stack trace). Auto-dismiss 4s, close button 44x44 touch target.

### Card (panel)

shadcn Card used as the items panel: bg card, border 1px border, radius lg (10px), shadow none (shadow-sm only on dark off — keep flat like the template), header padding 24px with title (18px/24px weight 600) and description (14px muted_fg), content padding 0 for the table, footer padding 16px 24px separated by border-top.

### Skeleton / Loading rows

While the items query is in flight the table body shows 3 skeleton rows that mirror the real column widths (Title 40%, Description 45%, Priority 72x20px badge shape, actions 32px circle). Skeleton fill #f5f5f5 (dark #262626), radius sm, subtle 1.6s pulse. Header row, filter and 'Add Item' stay interactive-looking but disabled until data arrives — no full-page spinner.

### InlineError

Inside the items Card content when the list request fails: centered block, destructive-tinted icon, heading 'Couldn't load items', body muted 'Check your connection and try again.', outline Button 'Retry' which refetches. Replaces table, filter, and empty states — never shows raw error text, status codes or SQL.

### AppSidebar

Existing AppSidebar, unchanged: 224px fixed column, bg card, border-right 1px, logo block at top, nav items 36px tall with 8px radius, active item bg muted + weight 500, footer with user menu (avatar initials, name, email, chevron dropdown: 'Settings', 'Log out'). Below 768px it collapses into a hamburger-triggered off-canvas drawer with 44px touch targets. Item priorities do not appear here.

### FormInput

Existing shadcn Input and Form field wrapper: h-9 (min-height 44px on touch), radius md, border 1px input, bg transparent, padding 0 12px, 14px text, placeholder muted_fg. States: hover border #d4d4d4, focus-visible ring 2px #a1a1a1 offset 0, invalid border destructive + 12px destructive helper text, disabled opacity 0.5. Label 12px weight 500 above with 8px gap; required fields get no asterisk but a zod message on submit.

## Layout Principles

- App shell: fixed 224px sidebar + main column; main content is centered with max-width 1024px and 24px horizontal / 32px vertical padding on desktop, 16px on mobile. Below 768px the sidebar becomes an off-canvas drawer and the main column takes the full width.
- Breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px (Tailwind defaults, unchanged). Tables never shrink below their content — they scroll horizontally inside their Card instead of reflowing into cards.
- Page rhythm: page header (title + muted subtitle) → primary panel; 24px between page header and the first card, 16px between stacked cards, 16px inside card headers, 24px content padding. Only one primary (solid accent) button per screen: 'Add Item' on the Items screen.
- One single format for every value the product prints: dates as en-US 'MMM d, yyyy' (e.g. 'Jan 5, 2026'), date+time appended with ' · ' and 24-hour time ('Jan 5, 2026 · 14:05'), never a numeric-only or locale-dependent date; counts as plain integers with a noun ('3 items'); money, if ever shown, as '$1,234.56' with two decimals and a thousands separator. Priority values are always printed lowercase exactly as stored ('low', 'medium', 'high'); only the filter's catch-all option is capitalised as 'All'.
- All UI copy stays English, sentence case, no exclamation marks; buttons are verb phrases ('Add Item', 'Save', 'Clear filter'), empty states say what happened and what to do next.
- Colour is never the only carrier of meaning: the PriorityBadge pairs its tint with a leading dot and the literal value text, so low/medium/high stay distinguishable in greyscale and for colour-blind users.
- Density follows the template: 14px body text, 36-44px control heights, flat cards with 1px borders and no shadows; dark mode is the same layout with the dark_* tokens swapped in via .dark, both modes shipped together.
- No new component library and no redesign of existing screens: this sprint only adds PriorityBadge, PrioritySelect and PriorityFilter into the existing Card/DataTable/Dialog structure.

## Screens

### Items (/)

Layout: Authenticated layout: 224px AppSidebar + main column (max-width 1024px, centered, 24px padding); inside it a page header followed by one full-width Card. Below 768px the sidebar collapses to a drawer, the filter takes its own row, 'Add Item' becomes full width, and the table scrolls horizontally with the Priority column pinned right.

- AppSidebar: logo, nav (Items, Settings, and Admin when the user is a superuser), user menu in the footer — unchanged from the template.
- Page header: 'Welcome back, {full_name}' as h1 with a muted one-line subtitle about managing items; no actions in the header itself.
- Toolbar row inside the Card header: Card title 'Items' with the muted results count ('3 items') and, right-aligned, the primary action Button 'Add Item' which opens the Add Item dialog.
- Filter bar directly above the table: PriorityFilter labelled 'Priority' with options All / low / medium / high, a ghost 'Clear filter' button that appears only when a specific priority is active, and the active-filter echo ('3 items · priority high'); changing it refetches GET /api/v1/items/?priority=… .
- Items DataTable: columns Title, Description (truncated, mutest), Priority (PriorityBadge with the colour-coded value) and a row-action menu (Edit → Edit Item dialog, Delete → confirm). Row hover highlight; clicking nothing outside those actions navigates away.
- Table footer: pagination control with 'Page 1 of 1' and rows-per-page select — only rendered because pagination exists in the template, and it works.
- Add Item / Edit Item dialogs (shadcn Dialog, max-w-md): Title, Description and the Priority PrioritySelect (default 'medium' in create, the item's current value in edit), footer Cancel + Save; on save the list refetches by query invalidation and a success toast confirms — no manual reload.

States: Loading: three skeleton rows in the table body while the header, filter and 'Add Item' stay visible. Empty (no items at all): 'No items yet' + body line + 'Add Item' button instead of rows. Empty (filter matches nothing): 'No items with priority "high"' + 'Clear filter' button, explicitly not the generic empty state. Error: InlineError inside the card with 'Couldn't load items' and a working 'Retry'; mutation failures surface as a destructive toast with the API's field message and leave the dialog open with the entered values intact.

### Login (/login)

Layout: Existing unchanged page: centered single column, 400px form card (max-w-sm), vertically centered with the logo above; full-width fields on mobile.

- Logo and product name above the form.
- Card: h1 'Login to your account' with a muted subtitle, Email input, Password input, 'Log In' primary button (full width).
- Secondary links row: 'Forgot your password?' and 'Sign up' as muted links — existing behaviour, nothing about priorities added here.

States: Loading: button shows its spinner and the fields are disabled while the request runs. Empty: not applicable (form is always presented). Error: invalid credentials show an inline destructive message under the form, never a raw API error or status code.

### Sign Up (/signup)

Layout: Existing unchanged page: centered 400px form card, vertically centered, full-width fields on mobile.

- Logo and product name above the form.
- Card: h1 'Create an account', Email, Password and Confirm Password inputs with client-side validation messages, 'Sign Up' primary button.
- Footer link 'Already have an account? Log in'.

States: Loading: submit button spinner with disabled fields. Empty: not applicable. Error: field-level zod messages plus a destructive form message for server errors (e.g. existing email).

### Settings (/settings)

Layout: Authenticated layout, single centered column (max-width 640px) of stacked Cards 24px apart; each Card holds one short form; folds to full width with 16px padding on mobile.

- Page header with h1 'Settings' and a muted subtitle.
- Card 'My profile': Full name input and Email (read-only styled as muted), 'Save' button.
- Card 'Password': Current password, New password, Confirm password, 'Update Password' button.
- Card 'Appearance': theme toggle (Light / Dark / System) implemented as a segmented control — switching it applies the .dark tokens so the PriorityBadge dark variants can be verified.
- Card 'Danger zone': 'Delete Account' destructive button with confirmation dialog.

States: Loading: profile card shows input skeletons until the current user resolves. Empty: not applicable. Error: inline destructive messages under the affected field, success in a toast; no priority-specific UI on this screen.

### Admin Users (/admin)

Layout: Authenticated layout, superuser-only; same shell as Items with a full-width Card containing the users DataTable; superuser guard redirects non-admins.

- Page header h1 'Users' with a muted subtitle and the total count.
- Card with the users DataTable: Full name, Email, Status badges (active / superuser), Role, and a row-action menu ('Edit user', 'Delete user') plus the primary 'Add User' button in the card header.
- Create / Edit user dialogs with full name, email, password and the active/superuser switches — unchanged behaviour.
- Priority appears nowhere on this screen (explicitly out of scope).

States: Loading: skeleton rows. Empty: 'No users yet' with 'Add User'. Error: InlineError with Retry; mutation errors as toasts.
