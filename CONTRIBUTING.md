# Contributing

This document describes the folder structure and naming conventions used in
this project. Follow it for new code and when touching existing code, so the
codebase stays predictable as multiple people work on it.

## Folder structure

```
src/
  assets/       static images, icons, logos
  components/   reusable/shared UI, grouped by domain or category
  context/      React context providers
  hooks/        shared hooks used across pages/components
  layouts/      route-level layout shells (AdminLayout, VendorLayout, ...)
  pages/        route-level screens, one folder per domain
  routes/       router configuration
  services/     API clients, grouped by domain
  theme/        MUI theme configuration
  utils/        generic helpers, shared types, validation schemas
```

## Naming convention

**Generic/categorical folders stay lowercase.** These are buckets for a
*kind* of thing, not a business domain: `components`, `pages`, `services`,
`hooks`, `utils`, `layouts`, `context`, `routes`, `theme`, `assets`, and
category folders inside `components/` that aren't domain-specific
(`buttons`, `cards`, `common`, `footer`, `navbars`, `sections`).

**Domain/feature folders use PascalCase.** A domain folder represents a
business area or a route-level feature: `Admin`, `Vendor`, `Customer`,
`Public`, `Bookings`, `Availability`, `Settings`, `Dashboard`,
`CreateListing`, `Listings`, `ViewProduct`, `FiltersSidebar`, etc. This
applies consistently across `components/`, `pages/`, and `services/` — e.g.
`pages/Vendor/Settings` has matching `components/Vendor/Settings` and
`services/Vendor/settings.ts`.

**Files:**
- React components: `PascalCase.tsx` (e.g. `BookingCard.tsx`)
- Hooks: `useCamelCase.ts` (e.g. `useVendorBookings.ts`)
- Services/utils/types: `camelCase.ts` (e.g. `settings.ts`, `types.ts`)

When in doubt: is this folder a *type of thing* (component, page, service) or
a *business domain* (Vendor, Booking, Admin)? Type-of-thing folders are
lowercase; domain folders are PascalCase.

## Imports

Imports are relative (no path aliases configured). `eslint` enforces import
ordering (builtin → external → internal → parent → sibling → index,
alphabetized) — run `npm run lint -- --fix` to auto-sort.

## Formatting

Prettier is configured (`.prettierrc.json`). Run `npm run format` to format
files you touch, or `npm run format:check` to verify. The existing codebase
has not been bulk-reformatted yet (to avoid merge conflicts with in-flight
branches) — format newly written/touched files as you go; a full-repo
reformat is planned as a one-time pass once outstanding branches are merged.

## Before opening a PR

- `npm run lint` — no new errors
- `npm run build` — must pass (`tsc -b && vite build`)
- Follow the naming convention above for any new folders/files
