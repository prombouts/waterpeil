---
name: pdok-leaflet-maps
description: Working with Leaflet, react-leaflet and Dutch PDOK geo-services (WMTS, WMS, WCS, AHN elevation, GeoTIFF) in this project. Use when adding map layers, markers, overlays, elevation queries, or flood-simulation features.
---

# PDOK + Leaflet maps

## Project layout
- Map component: `src/components/PdokMap.tsx` (react-leaflet `MapContainer`).
- Flood simulation: `src/components/FloodLayer.tsx` (WCS GeoTIFF → canvas overlay) and `src/components/FloodControls.tsx`.
- Marker data: `src/data/locations.ts` — items with `name`, `description`, `position: [lat, lng]`.

## PDOK services (free, no API key)
- BRT background WMTS: `https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/{variant}/EPSG:3857/{z}/{x}/{y}.png` — variants: `standaard`, `grijs`, `pastel`, `water`.
- Aerial photo: `https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_ortho25/EPSG:3857/{z}/{x}/{y}.jpeg`.
- AHN elevation WMS (0.5 m): layers `dtm_05m` (maaiveld/terrain) and `dsm_05m` (oppervlak/surface). Use `GetFeatureInfo` (info_format `application/json`) for point elevation in m NAP.
- AHN WCS for raster data: request GeoTIFF coverage for the visible bbox, decode with `geotiff.js` (`fromArrayBuffer`), read raster values as Float32; nodata is a large negative value — filter it out.

## Conventions
- Always attribute: Kadaster / PDOK in Leaflet `attribution`.
- Use `L.CRS.EPSG3857` (default) with the EPSG:3857 tile matrix sets; do not mix in EPSG:28992 (RD New) URLs unless converting coordinates with proj4.
- Leaflet default marker icons break under Vite bundling: import icon PNGs explicitly from `leaflet/dist/images/` and configure `L.Icon.Default.mergeOptions`, or use custom `L.icon`/`divIcon`.
- Import `leaflet/dist/leaflet.css` once (in `main.tsx` or the map component) — missing CSS causes broken tiles/controls.
- react-leaflet v5 requires React 19; children of `MapContainer` must be react-leaflet components or use `useMap()` hooks.
- For canvas overlays (flood layer), redraw on `moveend`/`zoomend`, debounce WCS fetches, and abort in-flight requests with `AbortController` when the view changes.
- Keep heavy raster work off the critical path: cap WCS request size, require a minimum zoom (project uses z ≥ 10), and show a status/hint while loading.
- Z-index: Leaflet panes go up to ~700; app UI panels overlaying the map need `z-index ≥ 1000` (project uses 1100 for `.flood-panel`).
