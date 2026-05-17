# CF·GRIND — Codeforces Unsolved Problem Tracker

A clean, fast, zero-dependency frontend project for tracking your unsolved Codeforces problems.

## Project Structure

```
cf-grind/
│
├── index.html              # Entry point — markup only
│
├── css/
│   ├── reset.css           # Box-model reset & base normalization
│   ├── variables.css       # CSS custom properties (design tokens)
│   ├── layout.css          # Header, sidebar, main-content grid
│   ├── components.css      # Buttons, inputs, toast, stats chips, pagination
│   ├── filters.css         # Sidebar tag chips, mode toggle, selected tags
│   ├── problems.css        # Problem grid, rows, rating tier colors
│   └── animations.css      # Keyframes, stagger, loading shimmer
│
└── js/
    ├── config.js           # Constants, tag list, rating helper, HTML escape
    ├── api.js              # Codeforces API calls (user.status + problemset)
    ├── filters.js          # Tag mode state, filter logic, tag UI rendering
    ├── render.js           # All DOM generation (table, pagination, states)
    └── app.js              # Main controller — orchestrates fetch → filter → render
```

## How to Use

1. Open `index.html` in any browser (no build step needed).
2. Type your **Codeforces handle** in the top-right input and press **FETCH** (or Enter).
3. All problems you have **not** solved with an `OK` verdict will be loaded.
4. Use the sidebar to:
   - Set **problems per page**
   - Filter by **rating range**
   - **Include** or **Exclude** problems by tag (click a tag chip in the selected mode)
5. Press **▶ APPLY FILTERS** to update the list.
6. Click any problem row — it opens on Codeforces in a new tab.
7. After you solve a problem on Codeforces, press **FETCH** again — it re-reads your submissions and the solved problem disappears from the list.

## Features

- **Tag include/exclude**: toggle between `+ INCLUDE` and `− EXCLUDE` mode, then click tags. Included tags turn green; excluded tags turn red with strikethrough. Multiple active filters are ANDed together.
- **Rating tiers**: color-coded badges matching Codeforces' official rank colors (grey → green → cyan → blue → violet → orange → red).
- **Persisted handle**: your handle is saved to `localStorage` so you don't have to retype it.
- **Solved after refresh**: on every FETCH, your latest accepted submissions are pulled fresh from the CF API — solved problems are automatically excluded.

## No Build Required

Pure HTML + CSS + JS. Just open `index.html` directly in your browser.
