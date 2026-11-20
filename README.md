# Prime Commerce: Sales Overview Dashboard

A responsive React admin dashboard for Prime Ecommerce Store India. It has four calculated KPI cards, a search box, Region and Status filters, a sortable transaction log, pagination, an empty state and CSV export. All figures are calculated in the browser from the 120 supplied transactions. There is no backend and no external API.

- Job ID: `xg2JlZp1vCL9WVzo1svW`
- Live preview: _add the HTTPS Vercel/Netlify URL here after deploying_
- QA evidence: [QA_REPORT.md](QA_REPORT.md) and the [`qa/`](qa/) folder

## Dependency versions

These are the versions installed from `package-lock.json`:

| Package | Version | Role |
|---|---|---|
| react | 18.3.1 | UI |
| react-dom | 18.3.1 | UI |
| vite | 5.4.21 | Dev server and production build |
| @vitejs/plugin-react | 4.7.0 | JSX and Fast Refresh |
| vitest | 2.1.9 | Unit tests (dev only) |

Built and tested with Node 26.12.0 and npm 11.20.0. Node 18 or newer is enough for Vite 5.

## Setup

```bash
npm ci            # install exactly what's in package-lock.json
npm run dev       # dev server at http://localhost:5173
npm test          # unit tests for search, filters, sorting, KPIs and formatting
npm run build     # production build into dist/
npm run preview   # serve dist/ locally at http://localhost:4173
```

## What it does

| Requirement | Implementation |
|---|---|
| KPIs from data, no fixed figures | `computeMetrics()` in `src/lib/transactions.js` runs on the **filtered** rows, using the definitions in `data/metric_definitions.csv`: Net revenue = Σ `net_amount_inr` for Completed; Completed orders = count of Completed; Average order = net revenue ÷ completed orders (0 if none); Refunds = count of Refunded |
| Case-insensitive search | Searches `transaction_id`, `product_name` and `customer_ref` (the `search_columns` in `data/filter_options.json`). Leading and trailing spaces are ignored |
| Region and Status filters | Options come from `data/filter_options.json`. They combine (AND) with the search |
| Sorting | Transaction ID, Amount and Date headers are buttons with `aria-sort`. Clicking a header again flips the direction. Default is Date, newest first (`default_sort`). On phones a "Sort by" dropdown replaces the hidden headers |
| Reset | The Reset button and the empty state's "Clear filters" button restore search, filters and sort |
| Empty state | "No transactions match your search. Clear filters to see all orders." |
| Formatting | ₹ with Indian digit grouping (`₹ 1,10,680`). Dates are shown as `DD MMM YYYY`, while the ISO dates stay in the data and in `<time datetime>` |
| Responsive | ≥1101px: 244px sidebar and 4 KPI columns. 1024–1100px: sidebar and 2 KPI columns. ≤1023px: compact top bar with a menu button. ≤767px: the table becomes accessible row cards (ARIA table roles are kept). The page never scrolls sideways |
| Export report | Downloads the current filtered and sorted rows as CSV (`toCSV()`). Everything happens in the browser |
| Styling | CSS Modules per component and design tokens in `src/styles/base.css`. No inline styles |

KPI cards show what each figure covers (for example "Status: Completed") instead of the "+12.4% from prior period" lines in the mock-up. The data has no prior period, so a percentage change would have to be made up.

## Component map

```
src/
├── main.jsx                      React root
├── App.jsx                       Layout; connects useTransactions to the components
├── transactions.json             The 120 supplied rows (same file as data/transactions.json)
├── hooks/useTransactions.js      Shared state: query, region, status, sort, page → filtered, sorted, paged rows and metrics
├── lib/transactions.js           Pure helpers: filter, sort, metrics, INR/date formatting, CSV
├── lib/transactions.test.js      Vitest unit tests (18)
├── styles/base.css               Design tokens, reset, focus ring, skip link
└── components/
    ├── Sidebar/                  Brand and primary nav (collapses to a top bar with a menu toggle)
    ├── Header/                   "Sales overview" title, data period, Export report
    ├── MetricCards/              Builds the 4 card configs from metrics
    ├── MetricCard/               Reusable presentational KPI tile
    ├── TransactionFilters/       Search, Region, Status, mobile Sort, Reset
    ├── TransactionTable/         Sortable table / mobile row cards
    ├── EmptyState/               No-results message with Clear filters
    └── Pagination/               "Showing 1–10 of N" and Previous/Next
data/                             Supplied fixtures (CSV/JSON, metric definitions, filter options)
qa/                               Test, build, Lighthouse and screenshot evidence
```

### Props

| Component | Props |
|---|---|
| `Sidebar` | `items?: string[]` (default: Overview, Transactions, Catalog, Reports, Settings), `active?: string` (default `"Overview"`) |
| `Header` | `rows: Transaction[]` (full dataset, used for the period label), `exportRows: Transaction[]` (rows to export) |
| `MetricCards` | `metrics: { netRevenue, completedOrders, averageOrder, refunds }` (numbers) |
| `MetricCard` | `label: string`, `value: string` (already formatted), `note?: string` |
| `TransactionFilters` | `filters: { query, region, status }`, `regions: string[]`, `statuses: string[]`, `sort: { column, direction }`, `onQueryChange(v)`, `onRegionChange(v)`, `onStatusChange(v)`, `onSortChange({ column, direction })`, `onReset()`, `canReset: boolean` |
| `TransactionTable` | `rows: Transaction[]` (current page), `sort: { column, direction }`, `onSort(columnKey)` |
| `EmptyState` | `onClear()` |
| `Pagination` | `page`, `pageCount`, `pageSize`, `matched`, `total` (numbers), `onPageChange(page)` |

`useTransactions(rows)` returns `filters`, `setQuery`, `setRegion`, `setStatus`, `reset`, `isFiltered`, `sort`, `toggleSort`, `setSortTo`, `filtered`, `sorted`, `metrics`, `page`, `pageCount`, `setPage`, `pageRows` and `total`. Any filter or sort change goes back to page 1.

## Accessibility

- Semantic `header`, `nav`, `main`, `section`, `table` with a caption, and `th scope="col"`
- Every control has a label. Search uses `role="search"`
- Sortable headers are real `<button>`s with `aria-sort` on the `<th>`
- The result count is an `aria-live="polite"` region, and the empty state uses `role="status"`
- There is a skip link, a visible focus ring, and 44px touch targets on mobile
- After "Clear filters", focus moves to the search box
- Lighthouse Accessibility score is 100 on the local preview

## Deployment

The app is a static site, so any static host works.

**Vercel:** import the GitHub repo. Framework preset: Vite, build command `npm run build`, output directory `dist`. Or use the CLI:

```bash
npx vercel --prod
```

**Netlify:** build command `npm run build`, publish directory `dist`. Or use the CLI:

```bash
npx netlify deploy --prod --dir=dist
```

After deploying, run Lighthouse on the HTTPS URL (Chrome DevTools → Lighthouse → Mobile → Performance) and record the result in `QA_REPORT.md`.
