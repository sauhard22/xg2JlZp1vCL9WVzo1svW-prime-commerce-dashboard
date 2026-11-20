# QA Report: Prime Commerce Dashboard

Job ID `xg2JlZp1vCL9WVzo1svW`. This report records only checks that were actually run. Anything not yet done is marked **TO DO**.

Test date: 2026-11-21 (IST). Machine: macOS (Darwin 25.6, Apple Silicon), Node 26.12.0, npm 11.20.0.
Build tested: `npm run build`, served with `npm run preview` (Vite production preview on localhost).

## 1. Automated checks

| Check | Command | Result | Evidence |
|---|---|---|---|
| Unit tests | `npm test` | 18 / 18 passed | [qa/unit-test-output.txt](qa/unit-test-output.txt) |
| Production build | `npm run build` | Succeeded, no warnings (JS 188.79 kB / 53.54 kB gzip) | [qa/build-output.txt](qa/build-output.txt) |
| Independent KPI check | Python script over `src/transactions.json` | Same figures as the UI (see below) | [qa/expected_values_python.txt](qa/expected_values_python.txt) |

Expected figures for the full dataset, calculated separately in Python: Net revenue **₹ 1,10,680**, Completed orders **60**, Average order **₹ 1,845** (110680 / 60 = 1844.67), Refunds **20**. The UI shows exactly these values.

Rounding note: with Region = East the average order is exactly 1,328.5. The UI rounds half up to **₹ 1,329**. Python's `round()` gives 1,328 because it rounds halves to the nearest even number. The underlying value is the same.

## 2. Manual functional checks

Run in Chrome 157 (the Chromium-based browser pane in the Claude desktop app) against the production preview. Results were read from the live DOM after real typing, clicking and keyboard input.

| ID | Action | Observed |
|---|---|---|
| QA-01 | Load page | "Showing 1–10 of 120 transactions"; cards ₹ 1,10,680 · 60 · ₹ 1,845 · 20 |
| QA-02 | Type `txn-25005` | 1 row: TXN-25005, Wireless Mouse, West, ₹ 2,397, 16 Sep 2026. Cards ₹ 2,397 · 1 · ₹ 2,397 · 0 |
| QA-03 | Type `WIRELESS mouse` | 13 rows, all Wireless Mouse (Python: 13) |
| QA-04 | Type `Cust-1017` | TXN-25088, TXN-25001 (Python: same two) |
| QA-05 | Region = East | 30 rows, all East. Cards ₹ 26,570 · 20 · ₹ 1,329 · 0 (Python: 26570 · 20 · 1328.5 · 0) |
| QA-06 | Status = Refunded | 20 rows, all Refunded. Cards ₹ 0 · 0 · ₹ 0 · 20 |
| QA-07 | `lamp` + North + Completed | 3 rows: TXN-25072, TXN-25036, TXN-25108. Cards ₹ 3,747 · 3 · ₹ 1,249 · 0 (Python: same) |
| QA-08 | Click Amount | `aria-sort="ascending"`; ₹ 499, 499, 524, 524, 524, 549, 549, 549, 574, 574 |
| QA-09 | Click Amount again | `aria-sort="descending"`; ₹ 3,897, 3,897, 3,872, 3,872, 3,872, 3,847 … |
| QA-10 | Click Date, then again | Descending (2026-11-12 first), then ascending (2026-09-01 first) |
| QA-11 | Type `zzz-nothing` | Empty state: "No transactions match your search. Clear filters to see all orders." + Clear filters button. Cards show zero ([screenshot](qa/chrome_1440px_empty_state.jpg)) |
| QA-12 | Click Clear filters / Reset | Search empty, Region and Status = All, 120 rows, original KPIs |
| QA-16 | Keyboard only | Tab order: Skip link → 5 nav links → Export report → search → Region → Status → Transaction / Amount / Date headers → Next. Enter and Space both toggle sort. The disabled Reset button and the hidden mobile Sort dropdown are skipped |
| QA-17 | Console | No messages at 390, 768, 1024 and 1440 px |
| — | Mobile menu (390px) | Menu button switches `aria-expanded` to true and shows the nav |
| — | Mobile sort dropdown (390px) | "Amount: low to high" → ₹ 499, 499, 524, 524 |

Transaction ID sort was also checked: ascending starts at TXN-25001 and the unit test confirms it ends at TXN-25120.

## 3. Viewport checks

Each check compares `document.documentElement.scrollWidth` with `innerWidth` at the emulated size.

| Browser | Width × height | Horizontal overflow | Layout | Screenshot |
|---|---|---|---|---|
| Chrome 157 | 1440 × 1000 | None (1440 = 1440) | Sidebar, 4 KPI columns, full table | [qa/chrome_1440px.jpg](qa/chrome_1440px.jpg) |
| Chrome 157 | 1024 × 900 | None (1024 = 1024) | Sidebar, 2 KPI columns, table fits | — |
| Chrome 157 | 768 × 1024 | None (768 = 768) | Top bar, 2 KPI columns, table fits (inner overflow 0) | [qa/chrome_768px.jpg](qa/chrome_768px.jpg) |
| Chrome 157 | 390 × 844 | None (390 = 390) | Top bar, 2 KPI columns, row cards, Sort dropdown | [qa/chrome_390px.jpg](qa/chrome_390px.jpg) |
| Firefox | 390 / 768 / 1440 | **TO DO** (Firefox isn't installed on the build machine) | | |
| Edge | 390 / 768 / 1440 | **TO DO** (Edge isn't installed on the build machine) | | |

A bug found and fixed during testing: at 768px the first version kept the sidebar, and the table overflowed by 94px. The layout now switches to the compact top bar below 1024px. The table wrapper also has `overflow-x: auto` as a fallback.

## 4. Lighthouse

| Target | Mode | Performance | Accessibility | Best practices | SEO | Timestamp (UTC) | Report |
|---|---|---|---|---|---|---|---|
| `http://localhost:4174/` (local preview) | Mobile (default throttling) | **100** | 100 | 100 | 100 | 2026-11-20T22:47:06Z | [html](qa/lighthouse_local_preview.report.html) |
| `http://localhost:4174/` (local preview) | Desktop preset | **100** | 100 | 100 | 100 | 2026-11-20T22:47:16Z | [html](qa/lighthouse_local_preview_desktop.report.html) |
| Deployed HTTPS URL | Mobile | **TO DO** | | | | | |

These runs used Lighthouse 12.8.2 (CLI) with headless Chrome 157. Mobile LCP was 1.2 s, TBT 0 ms and CLS 0.

**The local scores do not replace the required deployed-site run.** Once the site is live, run Lighthouse on the HTTPS URL and add the row above with the URL, environment and timestamp. Save the report as `qa/lighthouse_deployed.report.html`.
