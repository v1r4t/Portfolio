# Trim layer — backup and revert

This folder holds the `index.html` from **before** the print-margin layer was added
(2026-11-24). Nothing here is committed.

## Fastest revert (no file changes)

Open any page with `?bg=off`:

```
http://localhost:5173/?bg=off
```

That skips the whole layer at runtime. Remove the query to turn it back on.

## Full removal

1. Delete these three files:
   - `src/trim.css`
   - `src/trim.js`
   - `public/trim-frame.svg`
2. Delete these two lines from `index.html`:
   - `<link rel="stylesheet" href="/src/trim.css" />`
   - `<script type="module" src="/src/trim.js"></script>`
3. Optionally remove `.revert/` from `.gitignore`.

`index.html` in this folder is the pre-change copy. Only use it if no other edits
have been made to `index.html` since this backup — restoring it wholesale will
discard later work.
