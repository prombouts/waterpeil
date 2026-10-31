# Waterpeil

React web app die Nederland visualiseert op de [PDOK](https://www.pdok.nl) **BRT Achtergrondkaart** (Kadaster), met AHN-hoogte-informatie en een dijkdoorbraak-simulatie: kies een waterpeil en zie welk land onder water komt te staan. Wat er verder op de kaart komt is nog te bepalen — er staan nu voorbeeldmarkers (landmarks) in `src/data/locations.ts`.

## Stack

- [Vite](https://vite.dev) + React 19 + TypeScript
- [Leaflet](https://leafletjs.com) / [react-leaflet](https://react-leaflet.js.org)
- PDOK WMTS-tiles (gratis, geen API-key): `https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:3857/{z}/{x}/{y}.png`

## Functies

- **Hoogte-informatie (AHN)**: twee schakelbare overlays via het lagenmenu (rechtsboven) — maaiveld (`dtm_05m`) en oppervlak (`dsm_05m`), 0,5 m resolutie. Klik op de kaart om de exacte hoogte (m t.o.v. NAP) op dat punt op te vragen (WMS GetFeatureInfo).
- **Dijkdoorbraak-simulatie**: kies een waterpeil (in stappen van 0,5 m, −2 t/m +10 m NAP) en zie welk land onder water komt te staan. De app haalt ruwe AHN-maaiveldhoogtes voor het zichtbare kaartbeeld op via de PDOK **WCS** (GeoTIFF, gedecodeerd met geotiff.js) en kleurt alle pixels onder het gekozen peil blauw — donkerder naarmate het water dieper staat. Let op: dit is een vereenvoudigd &ldquo;badkuip&rdquo;-model (geen rekening met waterstromen, dijkringen of gemalen). Zoom minimaal tot niveau 10 in.
- Startweergave: Haarsteeg, met Waalwijk en 's-Hertogenbosch in beeld.
- Voorbeeldmarkers in `src/data/locations.ts`.

## Ontwikkelen

```sh
npm install
npm run dev      # dev-server op http://localhost:5173
npm run build    # productie-build naar dist/
npm run preview  # lokaal de build bekijken
```

## Eigen data tonen

Pas `src/data/locations.ts` aan (of vervang door een fetch naar een API/GeoJSON) — elk item heeft `name`, `description` en `position` (`[lat, lng]`). De markers worden gerenderd in `src/components/PdokMap.tsx`.

## Deployen naar Azure Static Web Apps

1. Maak in Azure een **Static Web App** aan (Free tier volstaat) en koppel deze aan je GitHub-repository, of maak hem los aan en gebruik het deployment token.
2. Zet het deployment token als repo-secret `AZURE_STATIC_WEB_APPS_API_TOKEN`.
3. De workflow `.github/workflows/azure-static-web-apps.yml` bouwt en deployt automatisch bij een push naar `main`.

Build-instellingen (als Azure ernaar vraagt): app location `/`, output location `dist`.

`public/staticwebapp.config.json` bevat de SPA-fallback-configuratie.

## Andere PDOK-lagen

PDOK biedt meer lagen (luchtfoto, BGT, grijze/pastel varianten). Vervang de tile-URL in `PdokMap.tsx`, bijv.:

- Grijs: `.../wmts/v2_0/grijs/EPSG:3857/{z}/{x}/{y}.png`
- Pastel: `.../wmts/v2_0/pastel/EPSG:3857/{z}/{x}/{y}.png`
- Luchtfoto: `https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_ortho25/EPSG:3857/{z}/{x}/{y}.jpeg`
