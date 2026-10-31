---
name: webdesign-optimization
description: Web design and front-end performance optimization for this map SPA — responsive layout, accessibility, Core Web Vitals, bundle size, and visual polish. Use when improving UI/UX, styling, performance, Lighthouse scores, or mobile support.
---

# Web design optimization

## Design system
- Primary color: Rijksoverheid blue `#154273` (header). Keep the palette minimal: blue, white, neutral grays; blue water tints for the flood overlay.
- Font: `system-ui` stack (no webfont downloads — keep it that way for performance).
- UI panels floating over the map: white background, `border-radius: 6px`, subtle shadow `0 1px 6px rgba(0,0,0,.35)`, `z-index ≥ 1000`.

## Responsive & mobile
- The map must always fill the viewport: `.app` is a flex column, `.app-main` uses `flex: 1; min-height: 0`. Never give the map a fixed pixel height.
- Test at 360 px width: panels (`.flood-panel`, Leaflet controls) must not overlap or overflow; use `max-width`, wrap, or collapse panels behind a toggle on small screens.
- Touch targets ≥ 44×44 px for controls; range inputs need generous height on touch devices.
- Use `clamp()`/relative units for typography; avoid horizontal scrolling at any breakpoint.

## Accessibility
- All interactive controls need visible focus styles and labels (`<label>` for inputs; `aria-label` for icon-only buttons).
- Color contrast ≥ 4.5:1 for text (check text over `#154273` and gray hint text `#666`/`#333`).
- Don't rely on color alone for the flood depth encoding — expose the selected level as text (already in `.flood-status`).
- Respect `prefers-reduced-motion` for animations/transitions.

## Performance / Core Web Vitals
- Budget: keep the entry JS chunk small; split heavy libs (`geotiff`) via dynamic `import()`. Run `npm run build` and review the Vite size report.
- Tiles & rasters dominate network cost: debounce map-driven fetches, abort stale requests (`AbortController`), and never fetch WCS rasters below zoom 10.
- Canvas overlays: reuse one canvas, draw with `ImageData`/typed arrays, avoid per-pixel object allocation; move decoding to a worker if frame drops occur.
- Ensure `<meta name="viewport">`, a proper `<title>`/description, and `theme-color` in `index.html`.
- Cache headers come from Azure Static Web Apps; immutable hashed assets in `dist/assets` are fine by default.
- Validate with Lighthouse (`npm run preview`, then audit): target ≥ 90 on Performance, Accessibility, Best Practices.

## Visual polish checklist
- Consistent spacing scale (multiples of 0.2 rem as used in `index.css`).
- Loading/empty states for async data (elevation popup, flood layer status).
- Hover/active/disabled states for every control.
- Attribution and hints legible but unobtrusive (small, muted, never hidden).
