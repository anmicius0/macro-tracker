# 🛠 Maintenance Guide

## 1. System Architecture
The application follows a **local-first** architecture. There is no external backend; all user data (logs, food library, and targets) is stored in the browser's **IndexedDB** via Dexie.js.

- **Framework:** Next.js 16 (App Router)
- **Runtime:** React 19
- **Database:** Dexie.js (IndexedDB)
- **Styling:** Tailwind CSS 4 (using OKLCH color space)
- **Linter/Formatter:** Biome

## 2. Database Schema (`utils/db.ts`)
The database `MonolithDB` consists of three tables:

1.  **`foods`**: Stores the library of custom foods.
    - Primary Key: `name`
    - Fields: `protein_per_100g`, `carbs_per_100g`, `fat_per_100g`.
2.  **`entries`**: Daily food logs.
    - Primary Key: `++id` (auto-incrementing)
    - Index: `log_date` (format: `YYYY-MM-DD`)
3.  **`targets`**: Stores user-defined daily macro goals.
    - Single record with `id: 1`.

### Database Migrations
If you modify a table structure:
1.  Open `utils/db.ts`.
2.  Increment the version number in `this.version(X).stores(...)`.
3.  **Note:** Dexie handles schema changes automatically, but breaking changes (like renaming a field) may require a `.upgrade()` transformation.

## 3. Core Logic & Utilities
### Date Management
The app uses `en-CA` locale in `utils/core.ts` to generate `YYYY-MM-DD` strings. This ensures database keys are sortable and consistent across timezones.
```typescript
// utils/core.ts
export function getTodayDateStr(): string {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return new Date().toLocaleDateString("en-CA", { timeZone: tz });
}
```

### Macro Calculations
The standard multipliers are used across the app:
- **Protein:** 4 kcal/g
- **Carbohydrates:** 4 kcal/g
- **Fats:** 9 kcal/g

## 4. Styling & UI
### Tailwind CSS 4
The project uses the new CSS-first configuration. Theme variables are defined in `app/globals.css` using the `@theme` block.
- **Color Space:** Uses `oklch()` for perceptually uniform colors.
- **Dark Mode:** The app is hard-coded for dark mode (`color-scheme: dark`).
- **Interaction:** A custom `.interaction-tap` class is used for mobile-friendly scaling effects on buttons.

### Material Symbols
Icons are provided via a self-hosted variable font: `public/fonts/MaterialSymbolsOutlined.woff2`.
- To use an icon: `<span className="material-symbols-outlined">icon_name</span>`.
- Configuration (Weight/Fill) is handled via `font-variation-settings` in CSS.

## 5. Adding New Features
### Adding a New Page
1.  Create a directory in `app/`.
2.  Add a `page.tsx` (all pages currently use `"use client"` due to heavy DB interaction).
3.  Update `components/TopAppBar.tsx` if navigation is required.

### Modifying the Dashboard
The main dashboard logic resides in `app/page.tsx`. It uses `useLiveQuery` to reactively update the UI whenever the Dexie database changes.
- **Filtering:** Entries are filtered by `getTodayDateStr()`.
- **Progress:** The `MacroLine.tsx` component handles the logic for progress bars, including "goal met" (95-105%) and "over goal" states.

## 6. Maintenance Commands
The project uses **Biome** for all linting and formatting.

- **Check for errors:** `npm run check`
- **Auto-fix formatting/linting:** `npm run fix`
- **Development mode:** `npm run dev`
- **Production build:** `npm run build`

## 7. Known Considerations
1.  **PWA Support:** A `manifest.json` is present. For full offline support, a Service Worker (e.g., via `next-pwa`) would need to be configured.
2.  **Data Persistence:** Since data is stored in IndexedDB, clearing browser cache/data will delete user logs. Users should be advised to use browser export tools if data longevity is critical.
3.  **Decimal Precision:** Macro inputs use `step="0.1"`. Calculations use `Math.round()` for display to keep the UI clean, but underlying data preserves floating-point values where necessary.
