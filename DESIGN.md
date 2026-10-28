# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Neutrales, sachliches Dashboard im bestehenden shadcn-Look (Zink-Grau, Inter, 8px-Radien) — Priorität wird allein durch ein semantisch gefärbtes Badge und ein ruhiges Select erzählt, nie durch Flächenfarbe.

## Colors

- `--color-bg`: **#ffffff**
- `--color-bg-subtle`: **#fafafa**
- `--color-bg-muted`: **#f5f5f5**
- `--color-fg`: **#0a0a0a**
- `--color-fg-muted`: **#737373**
- `--color-accent`: **#171717**
- `--color-accent-hover`: **#262626**
- `--color-accent-fg`: **#fafafa**
- `--color-border`: **#e5e5e5**
- `--color-input-border`: **#d4d4d4**
- `--color-ring`: **#a1a1a1**
- `--color-destructive`: **#dc2626**
- `--color-destructive-fg`: **#ffffff**
- `--color-destructive-soft-bg`: **#fef2f2**
- `--color-destructive-soft-fg`: **#b91c1c**
- `--color-priority-low-bg`: **#f5f5f5**
- `--color-priority-low-fg`: **#525252**
- `--color-priority-low-border`: **#e5e5e5**
- `--color-priority-medium-bg`: **#fef3c7**
- `--color-priority-medium-fg`: **#92400e**
- `--color-priority-medium-border`: **#fde68a**
- `--color-priority-high-bg`: **#fee2e2**
- `--color-priority-high-fg`: **#b91c1c**
- `--color-priority-high-border`: **#fecaca**
- `--color-notice-bg`: **#fffbeb**
- `--color-notice-border`: **#fcd34d**
- `--color-notice-fg`: **#78350f**
- `--color-dark-bg`: **#0a0a0a**
- `--color-dark-bg-subtle`: **#171717**
- `--color-dark-fg`: **#fafafa**
- `--color-dark-fg-muted`: **#a1a1a1**
- `--color-dark-border`: **#262626**
- `--color-dark-priority-low-bg`: **#262626**
- `--color-dark-priority-low-fg`: **#d4d4d4**
- `--color-dark-priority-medium-bg`: **#451a03**
- `--color-dark-priority-medium-fg`: **#fcd34d**
- `--color-dark-priority-high-bg`: **#450a0a**
- `--color-dark-priority-high-fg`: **#fca5a5**

## Typography

- `heading_font`: "Inter", system-ui, "Segoe UI", Roboto, Arial, sans-serif
- `font_family`: "Inter", system-ui, "Segoe UI", Roboto, Arial, sans-serif
- `heading_weight`: 600
- `body_weight`: 400
- `size-display`: 24px/32px (page h1)
- `size-lg`: 18px/28px (card title)
- `size-body`: 14px/20px
- `size-sm`: 13px/18px (badges, table meta)
- `size-xs`: 12px/16px (muted labels)
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

Bestehender shadcn-Button, unverändert. Varianten: default (bg #171717, Text #fafafa), outline (Border #d4d4d4, bg transparent), ghost, destructive (bg #dc2626, Text #ffffff). Größen: default h-9 px-4, sm h-8 px-3, icon 36x36. Radius md (8px). States: hover default #262626 / outline bg #f5f5f5; active +translate-y-px und dunkler; focus-visible Ring 2px #a1a1a1, Offset 2px; disabled opacity 0.5 + pointer-events none; loading behält Breite, Label durch 16px-Spinner ersetzt, aria-busy. Unter 768px min-height 44px und min-width 44px für jeden Button, Select-Trigger und Icon-Button. Dialog-Aktionen rechtsbündig: 'Cancel' outline, 'Save' default; in Löschdialogen ist die destruktive Aktion rechts und trägt das Verb ('Delete', 'Delete account').

### PriorityBadge

Read-only Badge in der neuen Spalte 'Priority' und in der Item-Zeile der mobilen Ansicht. Form: inline-flex, items-center, gap 6px, h-22px, padding 2px 8px, Radius md (8px), Border 1px, Schrift size-sm 600, Label exakt 'Low' / 'Medium' / 'High' (immer Title Case, nie übersetzt). Vor jeder Stufe ein 6px-Punkt in der Textfarbe. Farben hell: low bg #f5f5f5 / Text #525252 / Border #e5e5e5; medium bg #fef3c7 / Text #92400e / Border #fde68a; high bg #fee2e2 / Text #b91c1c / Border #fecaca. Dunkel: low #262626 / #d4d4d4; medium #451a03 / #fcd34d; high #450a0a / #fca5a5. Kontrast Text-zu-Badge ≥ 4.5:1 in beiden Modi; Farbe ist nie das einzige Signal — der Text trägt die Bedeutung. Kein Hover, kein Klick, kein Tooltip.

### PrioritySelect (Filter)

shadcn Select als Filter über der Tabelle. Trigger: h-9, min-width 180px, Radius md, Border #d4d4d4, bg #ffffff, left icon 'Filter' (lucide) 16px in #737373, Text size-body; bei aktiver Auswahl zeigt der Trigger das gewählte Label in 500er-Gewicht und der Icon wird zur Prioritätsfarbe. Optionen in dieser Reihenfolge: 'All priorities' (Wert '', Standard), 'Low', 'Medium', 'High'; jede Optionszeile trägt zusätzlich den 6px-Punkt ihrer Stufe. Hover Option bg #f5f5f5, ausgewählte Option mit Check-Icon rechts. Bei Wechsel: Liste neu laden, Paginierung auf Seite 1, Trigger behält den Fokus. Während des Ladens bleibt der Trigger bedienbar, die Tabelle zeigt Skeleton-Rows. aria-label 'Filter by priority'. Unter 768px nimmt der Trigger die volle Breite einer eigenen Zeile ein, Höhe 44px.

### Select (Formularfeld)

Wiederverwendetes shadcn Select für die Dialoge (Priorität in Add/Edit Item) — und, wo das Template schon Selects nutzt, unverändert. Label über dem Feld, size-xs 600 #0a0a0a, 6px Abstand; Trigger h-9 volle Breite, Radius md, Border #d4d4d4, focus-visible Ring 2px #a1a1a1. Items 'Low' / 'Medium' / 'High' mit Punkt; Add-Dialog vorbelegt 'Medium', Edit-Dialog mit dem aktuellen Wert. Fehlerzustand: Border 1px #dc2626 und Hilfetext size-sm #b91c1c unter dem Feld, aria-invalid. Unter 768px Höhe 44px.

### Card

Bestehende shadcn Card, unverändert: bg #ffffff (dark #171717), Border 1px #e5e5e5, Radius lg (10px), kein Schatten. Card header: padding 16px 24px, Border-bottom 1px #e5e5e5, Card title size-lg 600, darunter/ daneben muted Zusatz size-sm #737373. Card content padding 24px; auf Mobile 16px. Gestapelte Cards 16px Abstand.

### ItemsTable

Tabelle im Card-Content, volle Breite, header-Zellen size-xs 600 uppercase tracking 0.04em #737373, padding 8px 12px, Border-bottom 1px #e5e5e5; Zeilen padding 12px, Border-bottom 1px #e5e5e5, Hover bg #fafafa, Höhe min 52px. Spalten (Desktop): ID (w-16, #737373, tabular), Owner (nur Superuser, Avatar 24px + Name), Item (Name/Description, 500, auf 2 Zeilen gekürzt), Priority (PriorityBadge, rechtsbündig), Actions (Icon-Button 'MoreHorizontal' 36x36, Menü 'Edit' / 'Delete' mit Trennlinie vor Delete in destruktiver Farbe). Die Spalte 'Priority' ist rechts gepinnt (position sticky right-0, bg wie Zeile, linker 1px-Schattenkante) und bleibt beim horizontalen Scrollen sichtbar. Unter 768px scrollt die Tabelle horizontal innerhalb der Card, statt in Karten umzubrechen; Zellen sind 44px hoch. Kopfzeile der Tabelle bleibt beim vertikalen Scrollen nicht sticky.

### TablePagination

Fußzeile der Card: padding 12px 24px, Border-top 1px #e5e5e5, links size-sm #737373 'Showing {from}–{to} of {count} items' (count = gefilterte Menge), rechts Buttons 'Previous' / 'Next' in outline sm. Previous disabled auf Seite 1, Next disabled wenn to >= count; disabled = opacity 0.5 und pointer-events none. Wechsel der Priorität setzt die Seite immer auf 1 zurück. Unter 768px stehen die Buttons in einer eigenen Zeile, 44px hoch, volle Breite je 1fr.

### FilterSummary / EmptyState

Leerzustand im Card-Content, zentriert, padding 48px 24px: lucide-Icon 32px #a1a1a1, Titel size-lg 600 #0a0a0a, Hilfetext size-body #737373, darunter eine Aktion. Zwei Fälle: (a) keine Items vorhanden → '{0} No items yet / Create your first item to get started', Button 'Add Item'; (b) Filter ohne Treffer → 'No items with priority High', Ghost-Button 'Clear filter' (setzt Filter auf 'All priorities', Seite 1). Ist ein Filter aktiv, zeigt der Card-Header neben dem Titel den Zusatz '· High' (size-sm, #737373), damit die gefilterte Anzahl nicht als Gesamtzahl gelesen wird.

### Dialog (Add/Edit Item)

Bestehender shadcn Dialog, unverändert im Rahmen: max-width 480px, Radius lg (10px), Overlay schwarz/50 mit 150ms Fade, padding 24px, Titel 'Add Item' bzw. 'Edit Item'. Felder in dieser Reihenfolge mit 16px Abstand: Name/Description (Input bzw. Textarea), Priority (Select, Add vorbelegt 'Medium', Edit mit aktuellem Wert). Footer rechtsbündig: 'Cancel' outline, 'Save' default; Save zeigt beim Speichern Spinner und bleibt disabled, bis die Anfrage beantwortet ist. Esc und Klick ins Overlay schließen, ohne zu speichern. Erfolg zeigt einen Toast ('Item created' / 'Item updated') und die Tabelle ist ohne manuelles Neuladen aktuell. Unter 768px füllt der Dialog die Breite minus 32px, Aktionen untereinander mit je 44px Höhe.

### ConfirmDialog (Delete item / Delete account)

shadcn AlertDialog: max-width 480px, Radius lg, Titel size-lg 600, Beschreibung size-body #737373 mit den konkreten Folgen ('This permanently deletes your account and the N items you created. This cannot be undone.'), Feld zur Bestätigung nur beim Konto-Löschen (Input muss die eigene E-Mail exakt enthalten, sonst bleibt der destruktive Button disabled). Footer: 'Cancel' outline links vom destruktiven Button ('Delete' / 'Delete account'), destruktiver Button bg #dc2626, hover #b91c1c, active #991b1b, disabled opacity 0.5. Beim Konto-Löschen zeigt der Button während der Anfrage einen Spinner; danach Redirect auf /login mit Toast 'Account deleted'.

### UserMenu

Bestehendes Nutzer-Menü in der Sidebar-Fußzeile, erweitert: Avatar 32px + voller Name + E-Mail (size-xs #737373) im Trigger, Dropdown mit 'Settings', 'Privacy policy' (öffnet /privacy), Trennlinie, 'Log out'. Einträge 40px hoch (Mobile 44px), Hover bg #f5f5f5. Das Menü enthält keine destruktive Aktion — Konto-Löschung wohnt in der Danger Zone der Settings-Seite.

### DangerZone

Abschnitt am Ende der Settings-Seite: Card mit Border 1px #fecaca, Card-Titel 'Danger zone' (size-lg 600 #b91c1c), Beschreibung size-sm #737373 ('Permanently delete your account and all items you created.'), rechts Button 'Delete account' variant outline mit Border #fecaca und Text #b91c1c; Hover bg #fef2f2; Touch-Ziel 44px. Öffnet den ConfirmDialog. Kein Hover-Effekt auf der Card selbst.

### LegalSection

Baustein der Datenschutzseite: Abschnitt mit h2 (size-lg 600 #0a0a0a) und 8px Abstand zum Text, Fließtext size-body #525252, Zeilenlänge max 72 Zeichen, Abschnitte 32px auseinander, optionale Anchor-id für Direktlinks (z. B. /privacy#rechte). Verarbeitungen als Tabelle (Zweck / Rechtsgrundlage / Speicherdauer / Empfänger) — gleiche Tabellenoptik wie ItemsTable, auf Mobile horizontal scrollend. Offene Betreiberangaben erscheinen als Notice-Box statt als Fließtext.

### NoticeBox (offene Betreiberangaben)

Callout für Angaben, die die Spezifikation nicht liefert (Hosting-Anbieter, Log-Aufbewahrung): bg #fffbeb, Border 1px #fcd34d, Radius md, padding 12px 16px, lucide 'TriangleAlert' 16px #78350f, Text size-sm #78350f. Inhalt immer mit dem Präfix '[By the operator to complete] ' gefolgt von der Angabe, damit auf der Seite sichtbar bleibt, was noch fehlt. Nicht schließbar.

### PrivacyLink

Text-Link 'Privacy policy', size-sm #737373, underline-offset 2px, Hover Text #0a0a0a + Unterstreichung, focus-visible Ring 2px #a1a1a1. Sitzt in der Sidebar-Fußzeile über dem Nutzer-Menü und im Footer jeder nicht authentifizierten Seite (Login, Register) sowie am Ende der E-Mail-Bestätigungs-/Passwort-Reset-Seiten. Touch-Ziel 44px hoch.

### Skeleton & Toast

Skeleton-Rows für die Tabelle während des Ladens: 4 Zeilen à 52px, bg #f5f5f5, Radius sm, je ein kurzer und zwei lange Balken, kein Layout-Sprung (Tabelle behält Spaltenbreiten). Toast (shadcn Sonner, unten rechts) für 'Item created', 'Item updated', 'Item deleted', 'Account deleted'; 4s, schließbar.

### PageHeader

Bestehender Seitenkopf: h1 'Welcome back, {full_name}' size-display 600 #0a0a0a (auf /privacy ersetzt durch den Seitentitel), darunter eine Zeile size-body #737373; keine Buttons im Kopf. 24px Abstand zur ersten Card, auf Mobile 16px.

## Layout Principles

- App-Shell: fester 224px AppSidebar + Hauptspalte, Inhalt zentriert mit max-width 1024px und 24px horizontal / 32px vertikal Padding (Mobile 16px). Unter 768px wird die Sidebar ein Off-canvas-Drawer, die Hauptspalte nimmt die volle Breite.
- Breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px (Tailwind-Defaults, unverändert). Tabellen schrumpfen nie unter ihre Inhaltsbreite — sie scrollen horizontal in der Card.
- Seitenrhythmus: PageHeader (Titel + gedämpfter Untertitel) → primäres Panel; 24px zwischen Kopf und erster Card, 16px zwischen gestapelten Cards, 16px in Card-Headern, 24px Content-Padding (Mobile 16px).
- Genau eine primäre (gefüllte) Aktion pro Screen: 'Add Item' auf /items, 'Save' im Dialog, 'Delete account' bleibt outline-destruktiv und ist nie die primäre Aktion der Seite.
- Card-Header von /items: links Titel 'Items' + gedämpfte Trefferzahl, rechts in einer Reihe Filter-Select und 'Add Item' (Reihenfolge: Filter, dann Aktion). Unter 768px rückt der Filter in eine eigene volle Zeile über der Tabelle, 'Add Item' wird volle Breite, die Zahl bleibt beim Titel.
- Spaltenreihenfolge der Item-Tabelle ist fix: ID · Owner (nur Superuser) · Item · Priority · Actions; 'Priority' steht vor 'Actions' und ist rechts gepinnt, damit sie beim horizontalen Scrollen auf Mobile sichtbar bleibt.
- Ein einziges Format für jeden ausgegebenen Wert: Datum/Uhrzeit immer '12 Mar 2025, 14:05' (UTC, englisches Monatskürzel, 24h), Dauer '1h 20m', Anzahl '{n} items' bzw. '{n} item' (Singular korrekt), Priorität immer 'Low' | 'Medium' | 'High', im Filter 'All priorities'. Alle Zahlen in tabular-nums.
- Zahl im Card-Header beschreibt immer die gefilterte Menge; ist ein Filter aktiv, steht zusätzlich das Filter-Label daneben ('2 items · High'), damit niemand sie für die Gesamtzahl hält.
- Fokus und Tastatur: sichtbarer Ring 2px #a1a1a1 (Offset 2px) auf jedem interaktiven Element, Dialog-Fokus auf dem ersten Feld, nach dem Schließen zurück auf den auslösenden Button; jede Aktion ist ohne Maus erreichbar.
- Farbe ist nie das einzige Signal: die Priorität trägt immer ihr Textlabel, offene Betreiberangaben tragen immer ihren '[By the operator to complete]'-Präfix.
- Die Datenschutzseite ist von jeder Seite erreichbar — in der Sidebar-Fußzeile, im Nutzer-Menü und im Footer der Login-/Register-Seiten — und nutzt die volle Lesebreite max-width 720px mit zentriertem Textblock.

## Screens

### Items (/items)

Layout: App-Shell mit 224px Sidebar + Hauptspalte (max-width 1024px, zentriert); PageHeader, darunter eine volle Card. Unter 768px Sidebar als Drawer, Filter eigene Zeile, 'Add Item' volle Breite, Tabelle scrollt horizontal mit gepinnter Priority-Spalte.

- PageHeader: h1 'Welcome back, {full_name}', darunter gedämpft 'Manage your items and keep track of their priority.' — keine Aktion im Kopf.
- Card-Header: Titel 'Items', daneben gedämpfte Trefferzahl ('4 items', bei aktivem Filter '2 items · High'); rechts PrioritySelect-Filter ('All priorities' | 'Low' | 'Medium' | 'High') und primärer Button 'Add Item'.
- ItemsTable: Spalten ID · Item · Priority · Actions (Owner zusätzlich für Superuser); jede Zeile zeigt das PriorityBadge (Low/Medium/High) in der vorletzten Spalte, die rechts gepinnt ist; das Actions-Menü bietet 'Edit' (öffnet den Edit-Dialog) und 'Delete' (ConfirmDialog).
- TablePagination in der Card-Fußzeile: 'Showing 1–10 of 4 items', 'Previous' / 'Next'; jede Filteränderung setzt auf Seite 1 zurück.
- Add/Edit-Dialog mit Feld 'Priority' (Select, Add vorbelegt Medium, Edit mit aktuellem Wert) — primäre Aktion 'Save', Tabelle und Badge aktualisieren sich unmittelbar per Query-Invalidierung.
- Sidebar-Fußzeile: PrivacyLink 'Privacy policy' und das Nutzer-Menü (Settings, Privacy policy, Log out).

States: Loading: Skeleton-Rows (4 × 52px) im Card-Content, Filter und 'Add Item' bleiben bedienbar, Trefferzahl als gedämpfter Platzhalter. Empty (keine Items): 'No items yet' mit Button 'Add Item'. Empty (Filter ohne Treffer): 'No items with priority High' mit Ghost-Button 'Clear filter'. Error: Fehlerzeile in der Card mit 'Could not load items.' und Button 'Retry'; Fehler beim Anlegen/Bearbeiten/Löschen als destruktiver Toast, Dialog bleibt offen.

### Settings (/settings)

Layout: App-Shell wie /items; einspaltige Card-Liste max-width 1024px mit 16px Abstand, unter 768px volle Breite und gestapelte Card-Header.

- PageHeader: h1 'Settings', darunter gedämpft 'Manage your account details and preferences.'
- Card 'User Information': E-Mail (read-only, gedämpft) und voller Name, Button 'Save' im Card-Footer.
- Card 'Change Password': Felder 'Current password', 'New password', 'Confirm password', Button 'Save'.
- Card 'Delete account' (DangerZone): Beschreibung 'Permanently delete your account and all items you created.' und Button 'Delete account' (outline-destruktiv) — öffnet den ConfirmDialog mit E-Mail-Bestätigung, danach Redirect auf /login.
- Sidebar-Fußzeile: PrivacyLink und Nutzer-Menü.

States: Loading: Skeleton-Balken für die Feldwerte, Buttons disabled. Empty (nicht anwendbar): — . Error: 'Could not load your account.' mit 'Retry'; fehlgeschlagenes Löschen zeigt destruktiven Toast im Dialog, Dialog bleibt offen. Erfolg: Toast 'Account deleted' nach Redirect auf /login.

### Privacy Policy (/privacy)

Layout: /privacy ist öffentlich erreichbar und nutzt dieselbe App-Shell (Sidebar bzw. Drawer); Textblock zentriert, max-width 720px, Abschnitte 32px auseinander, unter 768px 16px Seiten-Padding und scrollende Verarbeitungs-Tabelle.

- PageHeader: h1 'Privacy policy', darunter gedämpft 'Stand: 12 Mar 2025' und ein Inhaltsverzeichnis als Ankerliste (Verantwortlicher, Verarbeitungen, Empfänger, Rechte, Beschwerde).
- LegalSection 'Controller': Name und Kontakt des Verantwortlichen; nicht gelieferte Angaben als NoticeBox '[By the operator to complete] …'.
- LegalSection 'Processing activities' als Tabelle (Zweck / Rechtsgrundlage / Speicherdauer / Empfänger) mit je einer Zeile für Registrierung, Login und Server-Logs; Aufbewahrungsdauer der Logs und Hosting-Anbieter als NoticeBox.
- LegalSection 'Recipients and third-country transfers' mit NoticeBox für den noch zu benennenden Hoster bzw. Auftragsverarbeiter.
- LegalSection 'Your rights' (Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch) samt Hinweis auf die Kontolöschung unter Settings sowie LegalSection 'Right to complain' mit Verweis auf die zuständige Aufsichtsbehörde (NoticeBox, solange nicht benannt).
- Footer der Seite: PrivacyLink zurück, Button 'Back to items' (outline) als einzige Aktion.

States: Loading: statischer Text, kein Ladezustand nötig. Empty: — . Error: bei fehlender Konfiguration (z. B. Verantwortlicher nicht gesetzt) bleibt die Seite vollständig lesbar und markiert die Lücke als NoticeBox statt zu scheitern.

### Login (/login)

Layout: Zentrierte Karte max-width 400px ohne Sidebar, 16px Padding auf Mobile; Footer-Zeile unter der Karte.

- Card mit h1 'Log in to your account', Feldern E-Mail und Passwort (mit 'Forgot password?') und primärem Button 'Log in'.
- Zeile 'Don't have an account? Sign up' als Textlink.
- Footer: PrivacyLink 'Privacy policy' — damit die Datenschutzerklärung von jeder Seite erreichbar ist.

States: Loading: Button mit Spinner, Felder disabled. Empty: Felder leer, Autofokus auf E-Mail. Error: Fehlermeldung size-sm #b91c1c unter dem Formular ('Incorrect email or password'), Felder behalten die Eingabe.
