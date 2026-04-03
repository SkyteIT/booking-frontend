# Search Feature Explained (Beginner-Friendly)

This guide is written for a 2nd-year IT student.

Goal: after reading this, you should understand:
1. what happens in the UI,
2. what happens in code,
3. why URL query params are used,
4. how routing connects home page to search page.

## 1) First, what is a URL and what are query params?

A URL has parts. Example:

`/search?q=hotel&minPrice=100&minRating=4`

- `/search` -> this is the **route/path** (which page to open)
- `?q=hotel&minPrice=100&minRating=4` -> these are **query params** (small key-value data in URL)

Think of query params as: “settings for this page” stored in the URL.

### Why this is useful

If filter values are in URL:
- refresh page -> filters stay,
- copy link -> send to friend -> same filters open,
- browser back/forward -> previous filter states return.

Without query params, filters are lost on refresh/share.

## 2) Big picture of this feature

This feature lives in:
`src/pages/public/search`

Simple idea:

`User changes input -> URL query params update -> code reads params -> data filtered -> cards re-render`

So URL is the “source of truth” for filter state.

## 3) End-to-end UI flows (step by step)

## Flow A: from Hero Search on home page

1. User types in hero fields.
2. User clicks `Search`.
3. `HeroSection` builds URL params and navigates to `/search?...`.
4. Search page opens.
5. Hook reads query params and turns them into `filters` object.
6. Filter function runs on mock data.
7. Results grid shows matching cards.

Important: right now search feature uses `q`, category, price, rating. Hero also sends `location/guests/date`, but only `q` is currently used in filter logic.

## Flow B: from Category section on home page

1. User clicks a category card, e.g. `Hotels`.
2. App navigates to `/search?category=Hotels`.
3. Search page reads category from URL.
4. Category button looks selected.
5. Results show only hotel items.

## Flow C: from Featured section on home page

1. User clicks `View All Listings`.
2. App navigates to `/search` (no filters).
3. Search page shows all items.

## Flow D: user changes filters on search page

### D1: Search text (top input)
1. User types text.
2. Hook updates `q` in URL.
3. List filters by matching title/category/location text.

### D2: Category click
1. User clicks category.
2. Hook adds/removes category in URL `category=...`.
3. Filter function includes only selected categories.

### D3: Price min/max
1. User types numbers.
2. Hook keeps only digits.
3. URL gets `minPrice`/`maxPrice`.
4. Filter function checks listing price range.

### D4: Minimum rating
1. User clicks rating option (e.g. 4+).
2. URL gets `minRating=4`.
3. Filter function keeps listings with rating >= 4.

### D5: Clear all
1. User clicks `Clear All`.
2. Hook removes category/price/rating params.
3. Query text remains (by design).
4. Results update immediately.

## 4) Mental model in plain language

Think of the app as 3 layers.

## Layer 1: UI components (buttons, inputs)
- They only collect user actions and display data.

## Layer 2: Hook (`useSearchResults`)
- Brain of the feature.
- Converts user actions into URL param changes.
- Reads URL params and builds filter object.

## Layer 3: Utils (`searchParams`, `filterListings`)
- Helper logic.
- `searchParams` converts URL text into typed values.
- `filterListings` applies actual filtering rules.

This separation keeps code easier to read and maintain.

## 5) File-by-file explanation

## `SearchResultsPage.tsx`
- Very small entry file.
- Only renders `SearchResultsScreen`.
- Purpose: clean feature entry point.

## `screens/SearchResultsScreen.tsx`
- Connects hook + UI components.
- Gets data/handlers from hook.
- Passes them as props to:
  - `SearchToolbar`
  - `FiltersSidebar`
  - `ResultsGrid`

## `hooks/useSearchResults.ts`
Main logic file.

### What it reads
- current URL params using `useSearchParams()`.

### What it creates
- `filters` object via `parseSearchFilters(searchParams)`.
- `filteredListings` via `filterListings(MOCK_LISTINGS, filters)`.

### Functions inside hook
- `setQuery(value)`:
  - updates/removes `q` in URL.
- `setMinPrice(value)`:
  - keeps digits only,
  - updates/removes `minPrice`.
- `setMaxPrice(value)`:
  - keeps digits only,
  - updates/removes `maxPrice`.
- `clearCategories()`:
  - removes `category` param.
- `toggleCategory(category)`:
  - if selected -> remove,
  - if not selected -> add.
- `setMinRating(rating)`:
  - set `minRating` or remove if undefined.
- `clearFilters()`:
  - removes `category`, `minPrice`, `maxPrice`, `minRating`.

Why hook is useful:
- UI stays simple,
- logic is in one place,
- easier to debug and reuse.

## `utils/types.ts`
Contains types:
- `ListingCategory` (allowed category strings)
- `Listing` (shape of one listing item)
- `SearchFilters` (shape of active filters)

Types reduce mistakes by making data structure explicit.

## `utils/searchParams.ts`

### `CATEGORIES`
List of valid categories.

### `parseSearchFilters(searchParams)`
Reads URL params and returns clean `SearchFilters` object.

Example:
- URL has `minPrice=abc` -> parse helper returns `undefined` (invalid number ignored).
- URL has `category=Hotels,Events` -> converts to category array.

## `utils/filterListings.ts`
Pure filtering function.

For each listing, checks in order:
1. text query match,
2. category match,
3. min price,
4. max price,
5. min rating.

If any check fails, listing is excluded.

## `data/mockListings.ts`
- Mock dataset used by this project.
- In future, this can be replaced by API data.

## `components/SearchToolbar.tsx`
- Top query input and result count.
- Calls `onQueryChange` while typing.

## `components/FiltersSidebar/*`
Split into small components:
- `FiltersSidebar.tsx` (parent wrapper)
- `FiltersHeader.tsx`
- `CategoryFilterSection.tsx`
- `PriceRangeFilterSection.tsx`
- `RatingFilterSection.tsx`
- `styles.ts` and `types.ts`

## `components/ResultsGrid.tsx`
- Receives filtered listings.
- Renders shared `ListingCard` for each item.
- Shows empty-state message if no results.

## 6) Routing changes (exactly what changed)

## `src/App.tsx`
Routes now:
- `/` -> `LandingPage`
- `/search` -> `SearchResultsPage`
- `*` -> redirect to `/`

Meaning: search page is a real route/page.

## Home page components that now navigate to `/search`
- `HeroSection.tsx`
  - submit navigates to `/search` with params.
- `CategoriesSection.tsx`
  - category click navigates to `/search?category=...`.
- `FeaturedSection.tsx`
  - `View All Listings` navigates to `/search`.

## 7) One complete example walkthrough

User opens home page, types `beach`, clicks Search.

1. URL changes to `/search?q=beach`.
2. Search screen loads.
3. Hook reads `q=beach`.
4. `parseSearchFilters` returns `{ q: "beach", ... }`.
5. `filterListings` checks every item for "beach" in title/category/location.
6. Matching items are returned.
7. `ResultsGrid` renders those items.

If user now clicks `4+ Stars`:
1. URL becomes `/search?q=beach&minRating=4`.
2. Hook re-runs with new params.
3. Filtering now requires both query match and rating >= 4.
4. Grid updates.

## 8) Debug tips for this feature

If result looks wrong:
1. Check current URL first.
2. Confirm params are what you expect.
3. Check `parseSearchFilters` output.
4. Check conditions in `filterListings`.
5. Check the props passed to `ResultsGrid`.

Most bugs here are either:
- wrong URL param key,
- wrong parse,
- or filter condition mismatch.
