# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MomentoMori Calendar is a React-based web application that visualizes life as a grid of weekly circles. Each circle represents one week of life, with filled circles showing weeks already lived and empty circles representing future weeks. The visualization uses a 90-year life expectancy displayed across two columns of 45 years each.

## Development Commands

**Install dependencies:**
```bash
npm i
```

**Start development server:**
```bash
npm run dev
```
Runs on `http://[::]:8080` (configured in vite.config.ts)

**Build for production:**
```bash
npm run build
```
Outputs to `docs/` directory (configured for GitHub Pages deployment)

**Build for development:**
```bash
npm run build:dev
```

**Lint code:**
```bash
npm run lint
```

**Preview production build:**
```bash
npm run preview
```

## Architecture

### Routing & Application Structure

- **Router:** Uses `HashRouter` from `react-router-dom` (required for GitHub Pages)
- **Base path:** `/momento-mori-calendar/` configured in vite.config.ts
- **Entry point:** `src/main.tsx` → `src/App.tsx` → `src/pages/Index.tsx`
- **Providers:** Application wrapped in QueryClientProvider, TooltipProvider, with Toaster and Sonner for notifications

### Component Hierarchy

The main calendar visualization follows this hierarchy:

```
Index.tsx (main page)
  └── MementoMoriCalendar.tsx (calendar container)
      └── WeekRow.tsx (renders one year/row of 52 weeks)
          └── Circle.tsx (individual week visualization)
```

**Index.tsx** - Main page component that:
- Manages birthday state (both `birthday` for display and `tempBirthday` for settings panel)
- Provides settings panel via Sheet component from shadcn-ui
- Contains BirthdayInput and refresh mechanism
- Defaults to June 1, 1980 as initial birthday

**MementoMoriCalendar.tsx** - Core calendar logic:
- Calculates completed weeks using `date-fns` utilities
- Renders two columns of 45 rows each (90 years total)
- Each row represents one year (52 weeks)
- Manages current week percentage for partial week filling
- Uses fixed life expectancy of 90 years
- Grid width calculated dynamically based on `circleSize` prop

**WeekRow.tsx** - Row rendering:
- Renders 52 Circle components (one for each week)
- Adds extra margin every 10 rows to visually separate decades
- Passes fill status and current week percentage to each Circle
- Implements staggered animation delays for visual effect

**Circle.tsx** - Individual week visualization:
- Three states: filled (past), partial (current week), empty (future)
- Tooltip shows age, week number, and date range for each circle
- Hover effects with scale transformation and color changes
- **Important:** Hardcoded birthdate of June 1, 1980 in `getDateRange()` method (line 54) - this should match the birthday from parent component but currently doesn't
- Uses SVG for partial week circles with animated stroke

**BirthdayInput.tsx** - Date input component:
- Three separate Select dropdowns for month/day/year
- Automatically adjusts days based on selected month/year
- Year range: 1900 to current year
- Updates parent immediately on change (controlled component)

### UI Component Library

Uses **shadcn-ui** components built on Radix UI primitives. All UI components are in `src/components/ui/`. The project uses a comprehensive set including:
- Form controls: Button, Input, Select, Switch, etc.
- Overlays: Dialog, Sheet, Popover, Tooltip
- Feedback: Toast (via Sonner), Alert
- Layout: Card, Separator, Tabs

### Styling

- **Tailwind CSS** for utility classes
- **Custom animations:** `animate-fade-up`, `animate-fade-in` defined in tailwind config
- **Custom colors:** `calendar-filled` and `calendar-empty` in Tailwind theme
- Path alias `@/` maps to `src/` directory

### State Management

- Local component state with React hooks (useState, useEffect)
- No global state management library
- TanStack Query (React Query) available but not currently used
- Date calculations handled by `date-fns` library

## Key Implementation Details

### Date Calculations

The calendar uses `date-fns` for all date math:
- `differenceInWeeks` - calculate total weeks lived
- `differenceInYears` - calculate age
- `addDays` - navigate week ranges
- `startOfWeek/endOfWeek` - current week boundaries

Week counting starts from birthday and counts full weeks (7-day periods).

### Two-Column Layout

Life visualization split into two columns:
- Column 1: Years 0-44 (rows 0-44)
- Column 2: Years 45-89 (rows 45-89)

`WeekRow` components in second column receive `actualRowIndex = rowIndex + 45` to calculate correct week numbers.

### Animation System

Circles have staggered fade-in animations:
- Base delay = `row * 5ms`
- Per-circle delay = `weekIndex * 3ms`
- Creates cascading appearance effect on page load

### Deployment

- **Build output:** `docs/` directory (not `dist/`)
- **Deployment:** GitHub Pages via push to `master` branch
- **Important:** Uses HashRouter because GitHub Pages doesn't support client-side routing with BrowserRouter

## Common Gotchas

1. **Hardcoded birthdate in Circle.tsx:** The `getDateRange()` function has a hardcoded birthdate (June 1, 1980) that doesn't sync with the user-selected birthday. This affects tooltip date calculations.

2. **HashRouter requirement:** Don't change to BrowserRouter - it won't work with GitHub Pages deployment.

3. **Two-state birthday management:** Index.tsx maintains both `birthday` (drives calendar) and `tempBirthday` (settings panel) to prevent recalculation on every change.

4. **Circle size:** Default is 5px. Grid width calculations depend on this value, so changes require updating spacing calculations.

5. **Path alias:** Always use `@/` for imports from `src/`, not relative paths like `../`.
