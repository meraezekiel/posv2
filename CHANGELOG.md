# Changelog

History of what has been built, so a later session can pick up where the last one stopped.
Newest first. Dates are when the work was done.

## 2026-09-19 — Images, persistence, VAT fix

### Added

- **Local persistence** (`src/store/persistence.ts`). The whole POS state is kept as one JSON
  blob in AsyncStorage under `posv2:state:v1`, written 400 ms after any change. The store
  hydrates on launch and the root layout holds a blank screen until fonts *and* saved data are
  ready, so a returning user never sees setup flash past.
  - Persisted: setup completion, store profile, VAT setting, owner PIN, products and stock,
    sales history, sale numbering, categories, held sales, printer/scanner settings, users,
    the day's cash count and closed state, and the in-progress cart.
  - Not persisted on purpose: being signed in (the PIN screen greets every launch) and
    half-typed payment amounts.
- **Photos for products and the store logo** (`src/components/ImageField`). Tapping the Logo box
  in setup step 2, or the Photo box on a product, opens a sheet with Take a photo / Choose from
  gallery / Remove. Picked images are copied into app storage (`src/domain/images.ts`) because
  Android clears its cache and a referenced file would later show as a blank box. Product photos
  appear as the thumbnail in the product list and on the product detail page.
- **"Start fresh · erase this phone"** in Settings → Backup and restore. Persistence made the
  seed data permanent, so there had to be a way back to first-run setup. Behind a confirmation.

### Fixed

- **"No VAT" could not be selected during setup.** `vatEnabled` was read inside the store's
  context `useMemo` but missing from its dependency array, so the tap updated state that no
  screen ever re-rendered with. The same class of bug would be caught by
  `react-hooks/exhaustive-deps`, which does not run here — see Known gaps.
- Split payments did not reach the drawer count: the cash half was captured from a stale
  closure, so end-of-day under-counted. Split amounts also now reset between sales.

## 2026-09-18 — Remaining flows (handoff 3)

Built from `Mobile POS Prototype.dc.html` (third export).

### Added

- **Onboarding**, six steps: welcome, store details (gated on a name), currency and VAT, owner
  PIN typed twice with a mismatch warning, camera permission with allow/deny states, first
  products.
- **Login / cashier select** with the PIN pad and a 30-second lockout after five wrong tries.
- **Product detail**: price, cost and margin, barcode, on-hand / sold / alert tiles, stock
  movement history, and delete behind a confirmation.
- **Categories**: add, rename, reorder.
- **Held sales**: Hold on the cart parks it, Resume restores it, Discard asks first.
- **Cart line sheet**: override a line's price, quick −5/−10/−20% discounts, remove the line.
- **Split payment**: part cash, part GCash, with "Put the rest on GCash" and a covered check.
- **Settings sub-pages**: printer (search, pair, paper width, auto-print, test page), scanner
  (beep, vibrate, scan mode, pair), users (deactivate/reactivate, add a cashier), backup.
- Shared **confirmation dialog** and **busy overlay**.

### Fixed

- The More tab was dead: its folder had no `_layout`, so the tab's route name did not match and
  navigation threw.
- Reason chips overflowed off-screen instead of wrapping.

## 2026-09-18 — Phase 2 (handoff 2)

### Added

- **Sales history** grouped by day, method filters, status badges, struck-through voided totals.
- **Sale detail** with reprint/share, and **void** / **refund** behind an owner-PIN sheet
  (demo PIN 1234, five tries then a 30-second lockout). Same-day-only void rule.
- **Refund**: pick items (partial or full), reason, stock goes back, sale marked partly refunded.
- **Inventory**: all / low / out filters, stock-in and adjustment with reasons and negatives.
- **Reports**: range chips, range total, sales/average/profit tiles with a "% of sales costed"
  note, best sellers, payment split, low-stock list.
- **End of day**: starting cash, today's cash sales, expected vs counted, over/short, close day.
- **More**: user card, store / hardware / data groups.
- **Cashier role**: Switch in More flips owner/cashier — voids, refunds and profit disappear.
- Completing a sale now writes it into history and takes the stock off the shelf.

### Fixed

- Toast crashed the app (animated style on a plain `View`).
- The Products tab reopened a stale quick-add form; that form now lives in the Sell stack.

## 2026-09-16 — Part 1 (handoff 1)

Expo SDK 57 app scaffolded and the first prototype built: Sell (live camera, reticle, torch and
scan-mode chips, cart, sticky charge bar), unknown-barcode quick add, Payment (cash pad, GCash,
Utang), Receipt, Products list and the add/edit form, and the five-tab bar. Design tokens taken
from the Nocturne export.

## Known gaps

- **Receipts are not real.** Print and share show toasts; the store logo is stored but not
  printed anywhere.
- **"Restore from a backup" is a simulation** — it warns and spins but restores nothing. Only
  "Back up now" and "Start fresh" touch real storage.
- **Real barcode scanning is unverified.** The scanner is wired to expo-camera
  (EAN-13/8, UPC, Code128, QR, 1.5 s duplicate guard, torch), but every test used the
  tap-to-simulate path — no physical barcode has been scanned yet.
- **Store profile and Tax and currency in More reopen onboarding** (the prototype's own
  behaviour), so editing them means stepping through setup again.
- **Category counts are placeholders** — products carry no category field yet.
- **No linter.** `npm run lint` fails because eslint is not installed, so the dependency-array
  bug above had nothing catching it. Installing `eslint` + `eslint-config-expo` is the cheapest
  next safeguard.
- **No tests.** Verification so far has been manual, driving the phone over adb.
- Sales history is one JSON blob; fine for a sari-sari store's volume, but SQLite is the move if
  it ever grows to tens of thousands of sales.

## Conventions

- `FILE_STRUCTURE.md` is mandatory: every component lives in
  `ComponentName/implementation/ComponentName.tsx` with a `useComponentNameHandler.ts`, extra
  hooks under `implementation/handler/`, and child components nested in their parent's folder.
  Route files in `src/app` stay thin and just render the component.
- `AGENTS.md`: read the versioned Expo docs (https://docs.expo.dev/versions/v57.0.0/) before
  writing code against an SDK module.
- Run on the phone with `adb reverse tcp:8081 tcp:8081` and
  `NODE_OPTIONS=--dns-result-order=ipv4first npx expo start --localhost`; Metro otherwise binds
  to IPv6 only and Expo Go cannot reach it.
